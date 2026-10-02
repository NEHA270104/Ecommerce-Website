/**
 * Vrishabhanvi Ventures
 * Cloudflare Worker + Static Assets
 *
 * Responsibilities:
 * - POST /api/auth/login
 * - GET  /api/auth/me
 * - POST /api/auth/logout
 * - Serve the Vite/React app for all non-API requests
 *
 * Admin authentication uses only:
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 * - AUTH_SECRET
 *
 * MongoDB is NOT used for admin authentication.
 */

// ============================================================
// Base64URL helpers
// ============================================================

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return base64UrlEncodeBytes(bytes);
}

function base64UrlDecodeBytes(str: string): Uint8Array {
  let base64 = str
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  const binary = atob(base64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function base64UrlDecode(str: string): string {
  const bytes = base64UrlDecodeBytes(str);
  return new TextDecoder().decode(bytes);
}

// ============================================================
// JWT helpers - HS256 using Web Crypto API
// ============================================================

type JwtPayload = {
  id: string;
  email: string;
  role: "admin";
  iat: number;
  exp: number;
};

async function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();

  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const completePayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(
    JSON.stringify(completePayload)
  );

  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(encoder.encode(secret)),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    toArrayBuffer(encoder.encode(signingInput))
  );

  const encodedSignature = base64UrlEncodeBytes(
    new Uint8Array(signature)
  );

  return `${signingInput}.${encodedSignature}`;
}

async function verifyJwt(
  token: string,
  secret: string
): Promise<JwtPayload> {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const [
    encodedHeader,
    encodedPayload,
    encodedSignature,
  ] = parts;

  // --------------------------
  // Validate JWT header
  // --------------------------

  let header: {
    alg?: string;
    typ?: string;
  };

  try {
    header = JSON.parse(
      base64UrlDecode(encodedHeader)
    );
  } catch {
    throw new Error("Invalid JWT header");
  }

  if (header.alg !== "HS256" || header.typ !== "JWT") {
    throw new Error("Unsupported JWT");
  }

  // --------------------------
  // Verify signature
  // --------------------------

  const encoder = new TextEncoder();

  const signingInput =
    `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(encoder.encode(secret)),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["verify"]
  );

  const signatureBytes =
    base64UrlDecodeBytes(encodedSignature);

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    toArrayBuffer(signatureBytes),
    toArrayBuffer(encoder.encode(signingInput))
  );

  if (!valid) {
    throw new Error("Invalid signature");
  }

  // --------------------------
  // Decode payload
  // --------------------------

  let payload: JwtPayload;

  try {
    payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    );
  } catch {
    throw new Error("Invalid JWT payload");
  }

  // --------------------------
  // Validate expiration
  // --------------------------

  const now = Math.floor(Date.now() / 1000);

  if (
    typeof payload.exp !== "number" ||
    payload.exp <= now
  ) {
    throw new Error("Token expired");
  }

  if (
    payload.role !== "admin" ||
    typeof payload.email !== "string"
  ) {
    throw new Error("Invalid token claims");
  }

  return payload;
}

// ============================================================
// Secure string comparison
//
// Both values are SHA-256 hashed first so the final comparison
// always operates on fixed-length 32-byte values.
// ============================================================

async function safeCompare(
  a: string,
  b: string
): Promise<boolean> {
  if (
    typeof a !== "string" ||
    typeof b !== "string"
  ) {
    return false;
  }

  const encoder = new TextEncoder();

  const [aDigest, bDigest] = await Promise.all([
    crypto.subtle.digest(
      "SHA-256",
      toArrayBuffer(encoder.encode(a))
    ),
    crypto.subtle.digest(
      "SHA-256",
      toArrayBuffer(encoder.encode(b))
    ),
  ]);

  const aBytes = new Uint8Array(aDigest);
  const bBytes = new Uint8Array(bDigest);

  let mismatch = 0;

  for (let i = 0; i < aBytes.length; i++) {
    mismatch |= aBytes[i] ^ bBytes[i];
  }

  return mismatch === 0;
}

// ============================================================
// Environment bindings
// ============================================================

export interface Env {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  AUTH_SECRET?: string;

  ASSETS: {
    fetch: (
      request: Request
    ) => Promise<Response>;
  };
}

// ============================================================
// Response helpers
// ============================================================

function jsonResponse(
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extraHeaders,
      },
    }
  );
}

// ============================================================
// Cookie helpers
// ============================================================

const AUTH_COOKIE_NAME = "vv_admin_token";

function getAuthToken(
  request: Request
): string | null {
  const cookieHeader =
    request.headers.get("Cookie") || "";

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) =>
      part.startsWith(
        `${AUTH_COOKIE_NAME}=`
      )
    );

  if (!cookie) {
    return null;
  }

  return cookie.slice(
    AUTH_COOKIE_NAME.length + 1
  ) || null;
}

function createAuthCookie(
  token: string
): string {
  return [
    `${AUTH_COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${7 * 24 * 60 * 60}`,
  ].join("; ");
}

function createClearAuthCookie(): string {
  return [
    `${AUTH_COOKIE_NAME}=`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0",
  ].join("; ");
}

// ============================================================
// Worker
// ============================================================

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    const url = new URL(request.url);

    // ========================================================
    // API ROUTES
    // ========================================================

    if (url.pathname.startsWith("/api/")) {

      // ------------------------------------------------------
      // POST /api/auth/login
      // ------------------------------------------------------

      if (
        url.pathname === "/api/auth/login"
      ) {
        if (request.method !== "POST") {
          return jsonResponse(
            {
              error:
                "Method Not Allowed",
            },
            405,
            {
              Allow: "POST",
            }
          );
        }

        try {
          const body =
            await request.json();

          const submittedEmail =
            typeof body?.email === "string"
              ? body.email
                .trim()
                .toLowerCase()
              : "";

          const submittedPassword =
            typeof body?.password === "string"
              ? body.password
              : "";

          // --------------------------------------------------
          // Read server-side credentials
          // --------------------------------------------------

          const configuredEmail =
            typeof env.ADMIN_EMAIL === "string"
              ? env.ADMIN_EMAIL
                .trim()
                .toLowerCase()
              : "";

          const configuredPassword =
            typeof env.ADMIN_PASSWORD === "string"
              ? env.ADMIN_PASSWORD
              : "";

          // --------------------------------------------------
          // Make sure authentication is configured
          // --------------------------------------------------

          if (
            !configuredEmail ||
            !configuredPassword
          ) {
            return jsonResponse(
              {
                error:
                  "Authentication service not configured.",
              },
              503
            );
          }

          // --------------------------------------------------
          // Compare credentials
          // --------------------------------------------------

          const emailMatches =
            await safeCompare(
              submittedEmail,
              configuredEmail
            );

          const passwordMatches =
            await safeCompare(
              submittedPassword,
              configuredPassword
            );

          if (
            !emailMatches ||
            !passwordMatches
          ) {
            return jsonResponse(
              {
                error:
                  "Invalid email or password",
              },
              401
            );
          }

          // --------------------------------------------------
          // JWT signing secret
          // --------------------------------------------------

          const authSecret =
            typeof env.AUTH_SECRET === "string"
              ? env.AUTH_SECRET
              : "";

          if (!authSecret) {
            return jsonResponse(
              {
                error:
                  "Authentication service not configured.",
              },
              503
            );
          }

          // --------------------------------------------------
          // Create JWT
          // --------------------------------------------------

          const token = await signJwt(
            {
              id: "env-admin",
              email: configuredEmail,
              role: "admin",
            },
            authSecret
          );

          // --------------------------------------------------
          // Set HttpOnly cookie
          // --------------------------------------------------

          const cookie =
            createAuthCookie(token);

          return jsonResponse(
            {
              success: true,
              message:
                "Logged in successfully",
              user: {
                email: configuredEmail,
                role: "admin",
              },
            },
            200,
            {
              "Set-Cookie": cookie,
            }
          );
        } catch {
          return jsonResponse(
            {
              error:
                "Invalid request",
            },
            400
          );
        }
      }

      // ------------------------------------------------------
      // GET /api/auth/me
      // ------------------------------------------------------

      if (
        url.pathname === "/api/auth/me"
      ) {
        if (request.method !== "GET") {
          return jsonResponse(
            {
              error:
                "Method Not Allowed",
            },
            405,
            {
              Allow: "GET",
            }
          );
        }

        const token =
          getAuthToken(request);

        if (!token) {
          return jsonResponse({
            authenticated: false,
          });
        }

        try {
          const authSecret =
            typeof env.AUTH_SECRET === "string"
              ? env.AUTH_SECRET
              : "";

          if (!authSecret) {
            throw new Error(
              "Missing authentication secret"
            );
          }

          const decoded =
            await verifyJwt(
              token,
              authSecret
            );

          return jsonResponse({
            authenticated: true,
            user: decoded,
          });
        } catch {
          return jsonResponse({
            authenticated: false,
          });
        }
      }

      // ------------------------------------------------------
      // POST /api/auth/logout
      // ------------------------------------------------------

      if (
        url.pathname === "/api/auth/logout"
      ) {
        if (request.method !== "POST") {
          return jsonResponse(
            {
              error:
                "Method Not Allowed",
            },
            405,
            {
              Allow: "POST",
            }
          );
        }

        return jsonResponse(
          {
            success: true,
            message:
              "Logged out successfully",
          },
          200,
          {
            "Set-Cookie":
              createClearAuthCookie(),
          }
        );
      }

      // ------------------------------------------------------
      // Unknown API route
      // ------------------------------------------------------

      return jsonResponse(
        {
          error:
            "Not Found API Route",
        },
        404
      );
    }

    // ========================================================
    // STATIC WEBSITE
    // ========================================================
    //
    // All normal website requests are served through the
    // Cloudflare Static Assets binding.
    //
    // ========================================================

    return env.ASSETS.fetch(request);
  },
};