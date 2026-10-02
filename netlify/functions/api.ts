import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getDb, checkMongoConnection } from "../../lib/mongodb.ts";
import {
  validateEmail,
  validatePassword,
  validateProductInput,
  validateCategoryInput,
  sanitizeMongoInput,
} from "../../server/validators.ts";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "../../server/rateLimiter.ts";
import { products as seedProducts } from "../../src/data/products.ts";

interface NetlifyEvent {
  path: string;
  httpMethod: string;
  headers: Record<string, string | undefined>;
  multiValueHeaders?: Record<string, string[] | undefined>;
  body: string | null;
  isBase64Encoded: boolean;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  multiValueHeaders?: Record<string, string[]>;
  body: string;
}

const AUTH_COOKIE_NAME = "vv_admin_token";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error("AUTH_SECRET environment variable is missing or insufficiently secure in Netlify environment.");
  }
  return secret.trim();
}

function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function parseCookies(header?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!header) return list;
  header.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const key = parts.shift()?.trim();
    if (key) {
      list[key] = decodeURIComponent(parts.join("=").trim());
    }
  });
  return list;
}

function serializeCookie(
  name: string,
  val: string,
  options: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
  } = {}
): string {
  let str = `${name}=${encodeURIComponent(val)}`;
  if (options.maxAge !== undefined) str += `; Max-Age=${options.maxAge}`;
  if (options.path) str += `; Path=${options.path}`;
  if (options.httpOnly) str += "; HttpOnly";
  if (options.secure) str += "; Secure";
  if (options.sameSite) {
    str += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`;
  }
  return str;
}

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  const cleanOrigin = origin.trim().replace(/\/+$/, "").toLowerCase();

  if (
    cleanOrigin === "https://vrishabhanvi.com" ||
    cleanOrigin === "https://www.vrishabhanvi.com" ||
    cleanOrigin.endsWith(".vrishabhanvi.com") ||
    cleanOrigin.endsWith(".netlify.app") ||
    cleanOrigin.endsWith(".pages.dev") ||
    cleanOrigin.startsWith("http://localhost:") ||
    cleanOrigin.startsWith("http://127.0.0.1:")
  ) {
    return true;
  }

  const frontendEnv = process.env.FRONTEND_URL?.trim();
  if (frontendEnv && frontendEnv !== "*") {
    const allowedList = frontendEnv
      .split(",")
      .map((url) => url.trim().replace(/\/+$/, "").toLowerCase())
      .filter(Boolean);
    if (allowedList.includes(cleanOrigin)) return true;
  }

  return false;
}

function getCorsHeaders(event: NetlifyEvent): Record<string, string> {
  const origin = event.headers.origin || event.headers.Origin;
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie, X-Requested-With, Cache-Control, Pragma, Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  };

  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

function jsonResponse(
  event: NetlifyEvent,
  statusCode: number,
  data: unknown,
  cookies: string[] = []
): NetlifyResponse {
  const corsHeaders = getCorsHeaders(event);
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    // Prevent Cloudflare (and any CDN) from caching API responses.
    // Without these, Cloudflare may serve a cached index.html for POST
    // requests, causing HTTP 405 Method Not Allowed on the login endpoint.
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Surrogate-Control": "no-store",
    "CDN-Cache-Control": "no-store",
    ...corsHeaders,
  };

  const multiValueHeaders: Record<string, string[]> = {};
  if (cookies.length > 0) {
    multiValueHeaders["Set-Cookie"] = cookies;
  }

  return {
    statusCode,
    headers,
    ...(cookies.length > 0 ? { multiValueHeaders } : {}),
    body: JSON.stringify(data),
  };
}

interface DecodedUser {
  id?: string;
  email: string;
  role: string;
}

function getSessionUser(event: NetlifyEvent): DecodedUser | null {
  const cookieHeader = event.headers.cookie || event.headers.Cookie;
  if (cookieHeader) {
    const cookies = parseCookies(cookieHeader);
    const token = cookies[AUTH_COOKIE_NAME];
    if (token) {
      try {
        const decoded = jwt.verify(token, getAuthSecret()) as DecodedUser;
        if (decoded && decoded.email && decoded.role) {
          return decoded;
        }
      } catch {
        // Invalid or expired token
      }
    }
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.substring(7).trim();
    if (bearerToken) {
      try {
        const decoded = jwt.verify(bearerToken, getAuthSecret()) as DecodedUser;
        if (decoded && decoded.email && decoded.role) {
          return decoded;
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

function getClientIp(event: NetlifyEvent): string {
  const clientIp =
    event.headers["client-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    event.headers["x-nf-client-connection-ip"] ||
    "127.0.0.1";
  return clientIp;
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const pathname = event.path.replace(/^\/\.netlify\/functions\/api/, "/api");
  const method = (event.httpMethod || "GET").toUpperCase();

  // 0. Handle CORS preflight
  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...getCorsHeaders(event),
        "Cache-Control": "no-store, no-cache, max-age=0",
      },
      body: "",
    };
  }

  try {
    // ── 1. GET /api/health ───────────────────────────────────────────────
    if (pathname === "/api/health" && method === "GET") {
      return jsonResponse(event, 200, {
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "vrishabhanvi-backend",
        runtime: "netlify-functions",
      });
    }

    // ── 2. GET /api/health/mongodb ───────────────────────────────────────
    if (pathname === "/api/health/mongodb" && method === "GET") {
      const result = await checkMongoConnection();
      if (result.ok) {
        return jsonResponse(event, 200, { connected: true });
      }
      return jsonResponse(event, 503, {
        connected: false,
        error: "MongoDB connection failed",
      });
    }

    // ── 3. POST /api/auth/login ──────────────────────────────────────────
    if (pathname === "/api/auth/login" && method === "POST") {
      const clientIp = getClientIp(event);

      // Rate limit check
      const rateCheck = await checkRateLimit(clientIp);
      if (!rateCheck.allowed) {
        const res = jsonResponse(event, 429, {
          error: `Too many failed login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        });
        res.headers["Retry-After"] = String(rateCheck.retryAfterSeconds);
        return res;
      }

      let body: Record<string, unknown> = {};
      try {
        body = event.body ? sanitizeMongoInput(JSON.parse(event.body)) : {};
      } catch {
        return jsonResponse(event, 400, { error: "Invalid JSON request body" });
      }

      const emailValidation = validateEmail(body.email);
      const passwordValidation = validatePassword(body.password);

      if (!emailValidation.valid || !emailValidation.email) {
        return jsonResponse(event, 400, { error: emailValidation.error || "Please enter a valid email address" });
      }
      if (!passwordValidation.valid || !passwordValidation.password) {
        return jsonResponse(event, 400, { error: passwordValidation.error || "Password is required" });
      }

      const cleanEmail = emailValidation.email;
      const cleanPassword = passwordValidation.password;

      // ── Authenticate using environment variables ONLY ──────────────────
      // Admin login does NOT query MongoDB. Credentials come exclusively from
      // the server-side environment variables ADMIN_EMAIL and ADMIN_PASSWORD.
      // This ensures login works even when the database is temporarily unavailable.
      const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD?.trim();

      if (!envEmail || !envPassword) {
        console.error("[Auth] ADMIN_EMAIL or ADMIN_PASSWORD is not configured in the environment.");
        return jsonResponse(event, 503, { error: "Authentication service not configured. Contact the administrator." });
      }

      // Constant-time comparison prevents timing-based credential enumeration attacks
      const emailMatches = safeCompare(cleanEmail, envEmail);
      const passwordMatches = safeCompare(cleanPassword, envPassword);

      if (!emailMatches || !passwordMatches) {
        await recordFailedAttempt(clientIp);
        return jsonResponse(event, 401, { error: "Invalid email or password" });
      }

      // ── Successful authentication ──────────────────────────────────────
      await resetRateLimit(clientIp);

      const authenticatedEmail = envEmail;
      const authenticatedRole = "admin";
      const adminId = "env-admin";

      // Generate JWT Token
      const tokenPayload = {
        id: adminId,
        email: authenticatedEmail,
        role: authenticatedRole,
      };

      const token = jwt.sign(tokenPayload, getAuthSecret(), {
        expiresIn: "7d",
      });

      // Set HTTP-only Cookie
      const isProduction = process.env.NODE_ENV === "production" || !!process.env.NETLIFY;
      const setCookie = serializeCookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return jsonResponse(
        event,
        200,
        {
          success: true,
          message: "Logged in successfully",
          user: {
            email: authenticatedEmail,
            role: authenticatedRole,
          },
        },
        [setCookie]
      );
    }

    // ── 4. POST /api/auth/logout ─────────────────────────────────────────
    if (pathname === "/api/auth/logout" && method === "POST") {
      const isProduction = process.env.NODE_ENV === "production" || !!process.env.NETLIFY;
      const clearCookie = serializeCookie(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return jsonResponse(
        event,
        200,
        { success: true, message: "Logged out successfully" },
        [clearCookie]
      );
    }

    // ── 5. GET /api/auth/me ──────────────────────────────────────────────
    if (pathname === "/api/auth/me" && method === "GET") {
      const user = getSessionUser(event);
      if (!user) {
        return jsonResponse(event, 401, { authenticated: false, error: "Unauthorized" });
      }

      return jsonResponse(event, 200, {
        authenticated: true,
        user: {
          email: user.email,
          role: user.role,
        },
      });
    }

    // ── 6. Public /api/orders (Price Verification Endpoint) ──────────────
    if (pathname === "/api/orders" && method === "POST") {
      let body: Record<string, unknown> = {};
      try {
        body = event.body ? sanitizeMongoInput(JSON.parse(event.body)) : {};
      } catch {
        return jsonResponse(event, 400, { error: "Invalid JSON request body" });
      }

      const items = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) {
        return jsonResponse(event, 400, { error: "Order must contain at least one item" });
      }

      let verifiedSubtotal = 0;
      const verifiedItems = [];

      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const itemObj = item as Record<string, unknown>;
        const productName = String(itemObj.name || "").trim();
        const quantity = Math.max(1, parseInt(String(itemObj.quantity || 1), 10) || 1);

        const matchedProduct = seedProducts.find(
          (p) => p.name.toLowerCase() === productName.toLowerCase()
        );

        const authoritativePrice = matchedProduct ? matchedProduct.price : Number(itemObj.price) || 0;
        if (authoritativePrice <= 0) {
          return jsonResponse(event, 400, { error: `Invalid product price for item: ${productName}` });
        }

        verifiedSubtotal += authoritativePrice * quantity;
        verifiedItems.push({
          name: productName,
          quantity,
          price: authoritativePrice,
          size: String(itemObj.size || "Free Size").slice(0, 20),
          color: String(itemObj.color || "Default").slice(0, 50),
        });
      }

      const shipping = verifiedSubtotal >= 999 ? 0 : 99;
      const verifiedTotal = verifiedSubtotal + shipping;

      return jsonResponse(event, 200, {
        success: true,
        verifiedSubtotal,
        shipping,
        verifiedTotal,
        items: verifiedItems,
      });
    }

    // ── 7. Protected /api/admin/* endpoints ──────────────────────────────
    if (pathname.startsWith("/api/admin")) {
      const user = getSessionUser(event);
      if (!user) {
        return jsonResponse(event, 401, { error: "Unauthorized. Admin session required." });
      }

      if (user.role !== "admin") {
        return jsonResponse(event, 403, { error: "Forbidden. Admin privileges required." });
      }

      // MongoDB health check for admin
      if (pathname === "/api/admin/health" && method === "GET") {
        const health = await checkMongoConnection();
        return jsonResponse(event, health.ok ? 200 : 503, health);
      }

      // Products endpoints
      if (pathname === "/api/admin/products") {
        if (method === "POST") {
          let rawBody: unknown = {};
          try {
            rawBody = event.body ? JSON.parse(event.body) : {};
          } catch {
            return jsonResponse(event, 400, { error: "Invalid JSON body" });
          }

          const validation = validateProductInput(rawBody);
          if (!validation.valid || !validation.data) {
            return jsonResponse(event, 400, { error: validation.error || "Invalid product data" });
          }

          try {
            const db = await getDb();
            const productsCol = db.collection("products");
            const result = await productsCol.insertOne({
              ...validation.data,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            return jsonResponse(event, 201, { success: true, id: result.insertedId });
          } catch {
            return jsonResponse(event, 503, { error: "Database unavailable" });
          }
        }

        if (method === "GET") {
          try {
            const db = await getDb();
            const productsCol = db.collection("products");
            const products = await productsCol.find({}).toArray();
            return jsonResponse(event, 200, { products });
          } catch {
            return jsonResponse(event, 200, { products: [], note: "MongoDB not connected" });
          }
        }
      }

      // Categories endpoints
      if (pathname === "/api/admin/categories") {
        if (method === "POST") {
          let rawBody: unknown = {};
          try {
            rawBody = event.body ? JSON.parse(event.body) : {};
          } catch {
            return jsonResponse(event, 400, { error: "Invalid JSON body" });
          }

          const validation = validateCategoryInput(rawBody);
          if (!validation.valid || !validation.data) {
            return jsonResponse(event, 400, { error: validation.error || "Invalid category data" });
          }

          try {
            const db = await getDb();
            const categoriesCol = db.collection("categories");
            const result = await categoriesCol.insertOne({
              ...validation.data,
              createdAt: new Date(),
            });
            return jsonResponse(event, 201, { success: true, id: result.insertedId });
          } catch {
            return jsonResponse(event, 503, { error: "Database unavailable" });
          }
        }

        if (method === "GET") {
          try {
            const db = await getDb();
            const categoriesCol = db.collection("categories");
            const categories = await categoriesCol.find({}).toArray();
            return jsonResponse(event, 200, { categories });
          } catch {
            return jsonResponse(event, 200, { categories: [], note: "MongoDB not connected" });
          }
        }
      }

      // Orders endpoints
      if (pathname === "/api/admin/orders") {
        try {
          const db = await getDb();
          const ordersCol = db.collection("orders");

          if (method === "GET") {
            const orders = await ordersCol.find({}).sort({ date: -1 }).toArray();
            return jsonResponse(event, 200, { orders });
          }
        } catch {
          return jsonResponse(event, 200, { orders: [], note: "MongoDB not connected" });
        }
      }

      // Customers endpoints
      if (pathname === "/api/admin/customers") {
        try {
          const db = await getDb();
          const customersCol = db.collection("customers");

          if (method === "GET") {
            const customers = await customersCol.find({}).toArray();
            return jsonResponse(event, 200, { customers });
          }
        } catch {
          return jsonResponse(event, 200, { customers: [], note: "MongoDB not connected" });
        }
      }

      // Catch-all for unhandled /api/admin routes
      return jsonResponse(event, 404, { error: "Admin endpoint not found" });
    }

    // Catch-all for any other /api/* routes
    return jsonResponse(event, 404, { error: "API endpoint not found" });
  } catch (error) {
    console.error("[Netlify API Error]:", error instanceof Error ? error.message : "Internal error");
    return jsonResponse(event, 500, {
      error: "Something went wrong. Please try again.",
    });
  }
};
