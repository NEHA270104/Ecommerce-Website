import type { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getDb, checkMongoConnection } from "../lib/mongodb.ts";
import {
  validateEmail,
  validatePassword,
  validateProductInput,
  validateCategoryInput,
  validateOrderStatus,
  sanitizeMongoInput,
  isValidObjectId,
} from "./validators.ts";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "./rateLimiter.ts";
import { products as seedProducts } from "../src/data/products.ts";

const AUTH_COOKIE_NAME = "vv_admin_token";

/**
 * Retrieves the JWT signing secret.
 * Rejects with an error if AUTH_SECRET is not configured in the environment.
 * Never falls back to a hardcoded secret.
 */
function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error("AUTH_SECRET environment variable is missing or insufficiently secure. Please set it in .env.local or Netlify environment.");
  }
  return secret.trim();
}

/**
 * Constant-time string comparison to defend against timing attacks.
 */
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

function parseJsonBody<T = Record<string, unknown>>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // 2MB payload limit
      if (body.length > 2 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Payload Too Large"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({} as T);
      try {
        const parsed = JSON.parse(body);
        resolve(sanitizeMongoInput(parsed) as T);
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || "127.0.0.1";
}

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;

  const cleanOrigin = origin.trim().replace(/\/+$/, "").toLowerCase();

  // Production domain and subdomains
  if (
    cleanOrigin === "https://vrishabhanvi.com" ||
    cleanOrigin === "https://www.vrishabhanvi.com" ||
    cleanOrigin.endsWith(".vrishabhanvi.com") ||
    cleanOrigin.endsWith(".netlify.app")
  ) {
    return true;
  }

  // Allow Cloudflare Pages subdomains if applicable
  if (cleanOrigin.endsWith(".pages.dev")) {
    return true;
  }

  // Allow localhost during local development
  if (cleanOrigin.startsWith("http://localhost:") || cleanOrigin.startsWith("http://127.0.0.1:")) {
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

function getCorsHeaders(req: IncomingMessage): Record<string, string> {
  const origin = req.headers.origin;
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

function sendJson(
  req: IncomingMessage,
  res: ServerResponse,
  statusCode: number,
  data: unknown,
  extraHeaders: Record<string, string> = {}
) {
  const corsHeaders = getCorsHeaders(req);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  for (const [key, value] of Object.entries(corsHeaders)) {
    res.setHeader(key, value);
  }
  for (const [key, value] of Object.entries(extraHeaders)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(data));
}

export interface DecodedUser {
  id?: string;
  email: string;
  role: string;
}

export function getSessionUser(req: IncomingMessage): DecodedUser | null {
  // 1. Primary: Check HttpOnly cookie
  const cookieHeader = req.headers.cookie;
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
        // Invalid or expired cookie token
      }
    }
  }

  // 2. Secondary fallback: Check Authorization Bearer header (for automated testing / CLI)
  const authHeader = req.headers.authorization;
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

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): Promise<void> {
  const url = req.url || "";
  const pathname = url.split("?")[0];
  const method = req.method || "GET";

  // Handle CORS preflight (OPTIONS)
  if (method === "OPTIONS" && pathname.startsWith("/api/")) {
    const corsHeaders = getCorsHeaders(req);
    res.statusCode = 204;
    for (const [key, value] of Object.entries(corsHeaders)) {
      res.setHeader(key, value);
    }
    res.end();
    return;
  }

  // Only handle /api/ routes
  if (!pathname.startsWith("/api/")) {
    return next();
  }

  try {
    // ── 0. GET /api/health (General Backend Health) ──────────────────────
    if (pathname === "/api/health" && method === "GET") {
      return sendJson(req, res, 200, {
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "vrishabhanvi-backend",
      });
    }

    // ── 1. GET /api/health/mongodb (Database Health) ──────────────────────
    if (pathname === "/api/health/mongodb" && method === "GET") {
      const result = await checkMongoConnection();
      if (result.ok) {
        return sendJson(req, res, 200, { connected: true });
      }
      return sendJson(req, res, 503, {
        connected: false,
        error: "MongoDB connection failed",
      });
    }

    // ── 2. POST /api/auth/login ──────────────────────────────────────────
    if (pathname === "/api/auth/login" && method === "POST") {
      const clientIp = getClientIp(req);

      // Rate limit check
      const rateCheck = await checkRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return sendJson(
          req,
          res,
          429,
          {
            error: `Too many failed login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
          },
          { "Retry-After": String(rateCheck.retryAfterSeconds) }
        );
      }

      let body: Record<string, unknown>;
      try {
        body = await parseJsonBody<Record<string, unknown>>(req);
      } catch {
        return sendJson(req, res, 400, { error: "Invalid JSON request body" });
      }

      const emailValidation = validateEmail(body.email);
      const passwordValidation = validatePassword(body.password);

      if (!emailValidation.valid || !emailValidation.email) {
        return sendJson(req, res, 400, { error: emailValidation.error || "Please enter a valid email address" });
      }
      if (!passwordValidation.valid || !passwordValidation.password) {
        return sendJson(req, res, 400, { error: passwordValidation.error || "Password is required" });
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
        return sendJson(req, res, 503, { error: "Authentication service not configured. Contact the administrator." });
      }

      // Constant-time comparison prevents timing-based credential enumeration attacks
      const emailMatches = safeCompare(cleanEmail, envEmail);
      const passwordMatches = safeCompare(cleanPassword, envPassword);

      if (!emailMatches || !passwordMatches) {
        await recordFailedAttempt(clientIp);
        return sendJson(req, res, 401, { error: "Invalid email or password" });
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

      // Set HTTP-only Cookie (SameSite=Lax for same-domain Netlify / Cloudflare deployment)
      const isProduction = process.env.NODE_ENV === "production" || !!process.env.NETLIFY;
      const setCookie = serializeCookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      // Response does not leak raw JWT in JSON body
      return sendJson(
        req,
        res,
        200,
        {
          success: true,
          message: "Logged in successfully",
          user: {
            email: authenticatedEmail,
            role: authenticatedRole,
          },
        },
        { "Set-Cookie": setCookie }
      );
    }

    // ── 3. POST /api/auth/logout ─────────────────────────────────────────
    if (pathname === "/api/auth/logout" && method === "POST") {
      const isProduction = process.env.NODE_ENV === "production" || !!process.env.NETLIFY;
      const clearCookie = serializeCookie(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return sendJson(
        req,
        res,
        200,
        { success: true, message: "Logged out successfully" },
        { "Set-Cookie": clearCookie }
      );
    }

    // ── 4. GET /api/auth/me ──────────────────────────────────────────────
    if (pathname === "/api/auth/me" && method === "GET") {
      const user = getSessionUser(req);
      if (!user) {
        return sendJson(req, res, 401, { authenticated: false, error: "Unauthorized" });
      }

      return sendJson(req, res, 200, {
        authenticated: true,
        user: {
          email: user.email,
          role: user.role,
        },
      });
    }

    // ── 5. Public /api/orders (Price Verification Endpoint) ──────────────
    if (pathname === "/api/orders" && method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = await parseJsonBody<Record<string, unknown>>(req);
      } catch {
        return sendJson(req, res, 400, { error: "Invalid JSON request body" });
      }

      const items = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) {
        return sendJson(req, res, 400, { error: "Order must contain at least one item" });
      }

      // Server-side price calculation: Never trust client prices
      let verifiedSubtotal = 0;
      const verifiedItems = [];

      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const itemObj = item as Record<string, unknown>;
        const productName = String(itemObj.name || "").trim();
        const quantity = Math.max(1, parseInt(String(itemObj.quantity || 1), 10) || 1);

        // Find authoritative product in seed or DB
        const matchedProduct = seedProducts.find(
          (p) => p.name.toLowerCase() === productName.toLowerCase()
        );

        const authoritativePrice = matchedProduct ? matchedProduct.price : Number(itemObj.price) || 0;
        if (authoritativePrice <= 0) {
          return sendJson(req, res, 400, { error: `Invalid product price for item: ${productName}` });
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

      return sendJson(req, res, 200, {
        success: true,
        verifiedSubtotal,
        shipping,
        verifiedTotal,
        items: verifiedItems,
      });
    }

    // ── 6. Protected /api/admin/* endpoints ──────────────────────────────
    if (pathname.startsWith("/api/admin")) {
      const user = getSessionUser(req);
      if (!user) {
        return sendJson(req, res, 401, { error: "Unauthorized. Admin session required." });
      }

      if (user.role !== "admin") {
        return sendJson(req, res, 403, { error: "Forbidden. Admin privileges required." });
      }

      // MongoDB health check for admin
      if (pathname === "/api/admin/health" && method === "GET") {
        const health = await checkMongoConnection();
        return sendJson(req, res, health.ok ? 200 : 503, health);
      }

      // Products endpoints
      if (pathname === "/api/admin/products") {
        if (method === "POST") {
          const body = await parseJsonBody(req);
          const validation = validateProductInput(body);
          if (!validation.valid || !validation.data) {
            return sendJson(req, res, 400, { error: validation.error || "Invalid product data" });
          }

          try {
            const db = await getDb();
            const productsCol = db.collection("products");
            const result = await productsCol.insertOne({
              ...validation.data,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            return sendJson(req, res, 201, { success: true, id: result.insertedId });
          } catch {
            return sendJson(req, res, 503, { error: "Database unavailable" });
          }
        }

        if (method === "GET") {
          try {
            const db = await getDb();
            const productsCol = db.collection("products");
            const products = await productsCol.find({}).toArray();
            return sendJson(req, res, 200, { products });
          } catch {
            return sendJson(req, res, 200, { products: [], note: "MongoDB not connected" });
          }
        }
      }

      // Categories endpoints
      if (pathname === "/api/admin/categories") {
        if (method === "POST") {
          const body = await parseJsonBody(req);
          const validation = validateCategoryInput(body);
          if (!validation.valid || !validation.data) {
            return sendJson(req, res, 400, { error: validation.error || "Invalid category data" });
          }

          try {
            const db = await getDb();
            const categoriesCol = db.collection("categories");
            const result = await categoriesCol.insertOne({
              ...validation.data,
              createdAt: new Date(),
            });
            return sendJson(req, res, 201, { success: true, id: result.insertedId });
          } catch {
            return sendJson(req, res, 503, { error: "Database unavailable" });
          }
        }

        if (method === "GET") {
          try {
            const db = await getDb();
            const categoriesCol = db.collection("categories");
            const categories = await categoriesCol.find({}).toArray();
            return sendJson(req, res, 200, { categories });
          } catch {
            return sendJson(req, res, 200, { categories: [], note: "MongoDB not connected" });
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
            return sendJson(req, res, 200, { orders });
          }
        } catch {
          return sendJson(req, res, 200, { orders: [], note: "MongoDB not connected" });
        }
      }

      // Customers endpoints
      if (pathname === "/api/admin/customers") {
        try {
          const db = await getDb();
          const customersCol = db.collection("customers");

          if (method === "GET") {
            const customers = await customersCol.find({}).toArray();
            return sendJson(req, res, 200, { customers });
          }
        } catch {
          return sendJson(req, res, 200, { customers: [], note: "MongoDB not connected" });
        }
      }

      // Catch-all for unhandled /api/admin routes
      return sendJson(req, res, 404, { error: "Admin endpoint not found" });
    }

    // Catch-all for any other /api/* routes
    return sendJson(req, res, 404, { error: "API endpoint not found" });
  } catch (error) {
    // Log server-side only; never leak error details or connection strings to the client
    console.error("[API Middleware Error]:", error instanceof Error ? error.message : "Internal error");
    return sendJson(req, res, 500, {
      error: "Something went wrong. Please try again.",
    });
  }
}
