import type { IncomingMessage, ServerResponse } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb, checkMongoConnection } from "../lib/mongodb.ts";

const AUTH_COOKIE_NAME = "vv_admin_token";
const DEFAULT_SECRET = "vv_jwt_default_secret_9f8e7d6c5b4a3210e9f8a7b6c5d4e3f2";

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || DEFAULT_SECRET;
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
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Payload Too Large"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({} as T);
      try {
        resolve(JSON.parse(body) as T);
      } catch {
        resolve({} as T);
      }
    });
    req.on("error", reject);
  });
}

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;

  const frontendEnv = process.env.FRONTEND_URL?.trim();
  if (!frontendEnv || frontendEnv === "*") return true;

  const allowedList = frontendEnv
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, "").toLowerCase())
    .filter(Boolean);

  const cleanOrigin = origin.trim().replace(/\/+$/, "").toLowerCase();

  // Exact match with any allowed URL
  if (allowedList.includes(cleanOrigin)) return true;

  // Allow localhost during dev
  if (cleanOrigin.startsWith("http://localhost:") || cleanOrigin.startsWith("http://127.0.0.1:")) {
    return true;
  }

  // Allow Cloudflare Pages subdomains if user configured base domain or *.pages.dev
  if (cleanOrigin.endsWith(".pages.dev")) {
    return true;
  }

  return false;
}

function getCorsHeaders(req: IncomingMessage): Record<string, string> {
  const origin = req.headers.origin;
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };

  // Only reflect specific allowed origin with credentials (never wildcard with credentials)
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
  res.setHeader("Content-Type", "application/json");

  for (const [key, value] of Object.entries(corsHeaders)) {
    res.setHeader(key, value);
  }
  for (const [key, value] of Object.entries(extraHeaders)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(data));
}

interface DecodedUser {
  id?: string;
  email: string;
  role: string;
}

function getSessionUser(req: IncomingMessage): DecodedUser | null {
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

  // 2. Secondary fallback: Check Authorization Bearer header (for direct API/CLI/scripts testing)
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
      const body = await parseJsonBody<{ email?: string; password?: string }>(req);
      const email = body.email?.trim() || "";
      const password = body.password || "";

      // Validation
      if (!email || !password) {
        return sendJson(req, res, 400, { error: "Email and password are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendJson(req, res, 400, { error: "Please enter a valid email address" });
      }

      let isAuthenticated = false;
      let authenticatedEmail = email;
      let authenticatedRole = "admin";
      let adminId = "admin-1";

      // 1. Try checking MongoDB admins collection
      try {
        const db = await getDb();
        const adminsCol = db.collection("admins");
        const adminDoc = await adminsCol.findOne({
          email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        });

        if (adminDoc && adminDoc.passwordHash) {
          const isMatch = await bcrypt.compare(password, adminDoc.passwordHash);
          if (isMatch) {
            isAuthenticated = true;
            authenticatedEmail = adminDoc.email;
            authenticatedRole = adminDoc.role || "admin";
            adminId = String(adminDoc._id);
          }
        }
      } catch (dbErr) {
        console.warn("[Auth API] MongoDB query error or not yet connected:", dbErr instanceof Error ? dbErr.message : dbErr);
      }

      // 2. Fallback to server-side environment variables
      if (!isAuthenticated) {
        const envEmail = process.env.ADMIN_EMAIL?.trim();
        const envPassword = process.env.ADMIN_PASSWORD;

        if (envEmail && envPassword) {
          if (
            email.toLowerCase() === envEmail.toLowerCase() &&
            password === envPassword
          ) {
            isAuthenticated = true;
            authenticatedEmail = envEmail;
            authenticatedRole = "admin";
            adminId = "env-admin";
          }
        }
      }

      if (!isAuthenticated) {
        return sendJson(req, res, 401, { error: "Invalid email or password" });
      }

      // Generate JWT Token
      const tokenPayload = {
        id: adminId,
        email: authenticatedEmail,
        role: authenticatedRole,
      };

      const token = jwt.sign(tokenPayload, getAuthSecret(), {
        expiresIn: "7d",
      });

      // Set HTTP-only Cookie (SameSite=None; Secure in production, SameSite=Lax in local dev)
      const isProduction = process.env.NODE_ENV === "production" || !!process.env.RENDER;
      const setCookie = serializeCookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      // Send response without exposing the raw JWT token in the JSON body
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
      const isProduction = process.env.NODE_ENV === "production" || !!process.env.RENDER;
      const clearCookie = serializeCookie(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
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

    // ── 5. Protected /api/admin/* endpoints ──────────────────────────────
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
        try {
          const db = await getDb();
          const productsCol = db.collection("products");

          if (method === "GET") {
            const products = await productsCol.find({}).toArray();
            return sendJson(req, res, 200, { products });
          }

          if (method === "POST") {
            const body = await parseJsonBody(req);
            const result = await productsCol.insertOne({
              ...body,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            return sendJson(req, res, 201, { success: true, id: result.insertedId });
          }
        } catch {
          return sendJson(req, res, 200, { products: [], note: "MongoDB not connected" });
        }
      }

      // Categories endpoints
      if (pathname === "/api/admin/categories") {
        try {
          const db = await getDb();
          const categoriesCol = db.collection("categories");

          if (method === "GET") {
            const categories = await categoriesCol.find({}).toArray();
            return sendJson(req, res, 200, { categories });
          }

          if (method === "POST") {
            const body = await parseJsonBody(req);
            const result = await categoriesCol.insertOne({
              ...body,
              createdAt: new Date(),
            });
            return sendJson(req, res, 201, { success: true, id: result.insertedId });
          }
        } catch {
          return sendJson(req, res, 200, { categories: [], note: "MongoDB not connected" });
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
    console.error("[API Middleware Error]:", error);
    return sendJson(req, res, 500, {
      error: "An unexpected server error occurred.",
    });
  }
}
