import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb, checkMongoConnection } from "../../lib/mongodb.ts";

const AUTH_COOKIE_NAME = "vv_admin_token";
const DEFAULT_SECRET = "vv_jwt_default_secret_9f8e7d6c5b4a3210e9f8a7b6c5d4e3f2";

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || DEFAULT_SECRET;
}

function parseCookies(header?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!header) return list;
  header.split(";").forEach((c) => {
    const parts = c.split("=");
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

interface DecodedUser {
  id?: string;
  email: string;
  role: string;
}

function getSessionUser(event: HandlerEvent): DecodedUser | null {
  const cookieHeader = event.headers.cookie || event.headers.Cookie;
  if (!cookieHeader) return null;

  const cookies = parseCookies(cookieHeader);
  const token = cookies[AUTH_COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, getAuthSecret()) as DecodedUser;
    if (decoded && decoded.email && decoded.role) {
      return decoded;
    }
  } catch {
    return null;
  }
  return null;
}

function jsonResponse(
  statusCode: number,
  body: unknown,
  cookies?: string[]
): HandlerResponse {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  };

  const response: HandlerResponse = {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };

  if (cookies && cookies.length > 0) {
    headers["Set-Cookie"] = cookies[0];
    response.multiValueHeaders = {
      "Set-Cookie": cookies,
    };
  }

  return response;
}

export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      },
      body: "",
    };
  }

  // Normalize path
  let pathname = event.path || "";
  if (pathname.startsWith("/.netlify/functions/api")) {
    pathname = "/api" + pathname.substring("/.netlify/functions/api".length);
  }
  if (!pathname.startsWith("/api")) {
    pathname = "/api" + (pathname.startsWith("/") ? pathname : "/" + pathname);
  }
  if (pathname.length > 4 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  const method = event.httpMethod.toUpperCase();

  try {
    // ── 1. GET /api/health/mongodb ────────────────────────────────────────
    if (pathname === "/api/health/mongodb" && method === "GET") {
      const result = await checkMongoConnection();
      if (result.ok) {
        return jsonResponse(200, { connected: true });
      }
      return jsonResponse(503, {
        connected: false,
        error: "MongoDB connection failed",
      });
    }

    // ── 2. POST /api/auth/login ──────────────────────────────────────────
    if (pathname === "/api/auth/login" && method === "POST") {
      let body: { email?: string; password?: string } = {};
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch {
        return jsonResponse(400, { error: "Invalid JSON body" });
      }

      const email = body.email?.trim() || "";
      const password = body.password || "";

      if (!email || !password) {
        return jsonResponse(400, { error: "Email and password are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return jsonResponse(400, { error: "Please enter a valid email address" });
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
        return jsonResponse(401, { error: "Invalid email or password" });
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

      // Set HTTP-only Cookie
      const setCookie = serializeCookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return jsonResponse(
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

    // ── 3. POST /api/auth/logout ─────────────────────────────────────────
    if (pathname === "/api/auth/logout" && method === "POST") {
      const clearCookie = serializeCookie(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return jsonResponse(
        200,
        { success: true, message: "Logged out successfully" },
        [clearCookie]
      );
    }

    // ── 4. GET /api/auth/me ──────────────────────────────────────────────
    if (pathname === "/api/auth/me" && method === "GET") {
      const user = getSessionUser(event);
      if (!user) {
        return jsonResponse(401, { authenticated: false, error: "Unauthorized" });
      }

      return jsonResponse(200, {
        authenticated: true,
        user: {
          email: user.email,
          role: user.role,
        },
      });
    }

    // ── 5. Protected /api/admin/* endpoints ──────────────────────────────
    if (pathname.startsWith("/api/admin")) {
      const user = getSessionUser(event);
      if (!user) {
        return jsonResponse(401, { error: "Unauthorized. Admin session required." });
      }

      if (user.role !== "admin") {
        return jsonResponse(403, { error: "Forbidden. Admin privileges required." });
      }

      // MongoDB health check for admin
      if (pathname === "/api/admin/health" && method === "GET") {
        const health = await checkMongoConnection();
        return jsonResponse(health.ok ? 200 : 503, health);
      }

      // Products endpoints
      if (pathname === "/api/admin/products") {
        try {
          const db = await getDb();
          const productsCol = db.collection("products");

          if (method === "GET") {
            const products = await productsCol.find({}).toArray();
            return jsonResponse(200, { products });
          }

          if (method === "POST") {
            const body = event.body ? JSON.parse(event.body) : {};
            const result = await productsCol.insertOne({
              ...body,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            return jsonResponse(201, { success: true, id: result.insertedId });
          }
        } catch {
          return jsonResponse(200, { products: [], note: "MongoDB not connected" });
        }
      }

      // Categories endpoints
      if (pathname === "/api/admin/categories") {
        try {
          const db = await getDb();
          const categoriesCol = db.collection("categories");

          if (method === "GET") {
            const categories = await categoriesCol.find({}).toArray();
            return jsonResponse(200, { categories });
          }

          if (method === "POST") {
            const body = event.body ? JSON.parse(event.body) : {};
            const result = await categoriesCol.insertOne({
              ...body,
              createdAt: new Date(),
            });
            return jsonResponse(201, { success: true, id: result.insertedId });
          }
        } catch {
          return jsonResponse(200, { categories: [], note: "MongoDB not connected" });
        }
      }

      // Orders endpoints
      if (pathname === "/api/admin/orders") {
        try {
          const db = await getDb();
          const ordersCol = db.collection("orders");

          if (method === "GET") {
            const orders = await ordersCol.find({}).sort({ date: -1 }).toArray();
            return jsonResponse(200, { orders });
          }
        } catch {
          return jsonResponse(200, { orders: [], note: "MongoDB not connected" });
        }
      }

      // Customers endpoints
      if (pathname === "/api/admin/customers") {
        try {
          const db = await getDb();
          const customersCol = db.collection("customers");

          if (method === "GET") {
            const customers = await customersCol.find({}).toArray();
            return jsonResponse(200, { customers });
          }
        } catch {
          return jsonResponse(200, { customers: [], note: "MongoDB not connected" });
        }
      }

      // Catch-all for unhandled /api/admin routes
      return jsonResponse(404, { error: "Admin endpoint not found" });
    }

    // Catch-all for any other /api/* routes
    return jsonResponse(404, { error: "API endpoint not found" });
  } catch (error) {
    console.error("[Netlify API Error]:", error);
    return jsonResponse(500, {
      error: "An unexpected server error occurred.",
    });
  }
};
