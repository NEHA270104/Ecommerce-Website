var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.ts
function toArrayBuffer(bytes) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}
__name(toArrayBuffer, "toArrayBuffer");
function base64UrlEncodeBytes(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncodeBytes, "base64UrlEncodeBytes");
function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  return base64UrlEncodeBytes(bytes);
}
__name(base64UrlEncode, "base64UrlEncode");
function base64UrlDecodeBytes(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
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
__name(base64UrlDecodeBytes, "base64UrlDecodeBytes");
function base64UrlDecode(str) {
  const bytes = base64UrlDecodeBytes(str);
  return new TextDecoder().decode(bytes);
}
__name(base64UrlDecode, "base64UrlDecode");
async function signJwt(payload, secret) {
  const encoder = new TextEncoder();
  const now = Math.floor(Date.now() / 1e3);
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const completePayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60
    // 7 days
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
      hash: "SHA-256"
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
__name(signJwt, "signJwt");
async function verifyJwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }
  const [
    encodedHeader,
    encodedPayload,
    encodedSignature
  ] = parts;
  let header;
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
  const encoder = new TextEncoder();
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(encoder.encode(secret)),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["verify"]
  );
  const signatureBytes = base64UrlDecodeBytes(encodedSignature);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    toArrayBuffer(signatureBytes),
    toArrayBuffer(encoder.encode(signingInput))
  );
  if (!valid) {
    throw new Error("Invalid signature");
  }
  let payload;
  try {
    payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    );
  } catch {
    throw new Error("Invalid JWT payload");
  }
  const now = Math.floor(Date.now() / 1e3);
  if (typeof payload.exp !== "number" || payload.exp <= now) {
    throw new Error("Token expired");
  }
  if (payload.role !== "admin" || typeof payload.email !== "string") {
    throw new Error("Invalid token claims");
  }
  return payload;
}
__name(verifyJwt, "verifyJwt");
async function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
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
    )
  ]);
  const aBytes = new Uint8Array(aDigest);
  const bBytes = new Uint8Array(bDigest);
  let mismatch = 0;
  for (let i = 0; i < aBytes.length; i++) {
    mismatch |= aBytes[i] ^ bBytes[i];
  }
  return mismatch === 0;
}
__name(safeCompare, "safeCompare");
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extraHeaders
      }
    }
  );
}
__name(jsonResponse, "jsonResponse");
var AUTH_COOKIE_NAME = "vv_admin_token";
function getAuthToken(request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find(
    (part) => part.startsWith(
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
__name(getAuthToken, "getAuthToken");
function createAuthCookie(token) {
  return [
    `${AUTH_COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${7 * 24 * 60 * 60}`
  ].join("; ");
}
__name(createAuthCookie, "createAuthCookie");
function createClearAuthCookie() {
  return [
    `${AUTH_COOKIE_NAME}=`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0"
  ].join("; ");
}
__name(createClearAuthCookie, "createClearAuthCookie");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === "/api/auth/login") {
        if (request.method !== "POST") {
          return jsonResponse(
            {
              error: "Method Not Allowed"
            },
            405,
            {
              Allow: "POST"
            }
          );
        }
        try {
          const body = await request.json();
          const submittedEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
          const submittedPassword = typeof body?.password === "string" ? body.password : "";
          const configuredEmail = typeof env.ADMIN_EMAIL === "string" ? env.ADMIN_EMAIL.trim().toLowerCase() : "";
          const configuredPassword = typeof env.ADMIN_PASSWORD === "string" ? env.ADMIN_PASSWORD : "";
          if (!configuredEmail || !configuredPassword) {
            return jsonResponse(
              {
                error: "Authentication service not configured."
              },
              503
            );
          }
          const emailMatches = await safeCompare(
            submittedEmail,
            configuredEmail
          );
          const passwordMatches = await safeCompare(
            submittedPassword,
            configuredPassword
          );
          if (!emailMatches || !passwordMatches) {
            return jsonResponse(
              {
                error: "Invalid email or password"
              },
              401
            );
          }
          const authSecret = typeof env.AUTH_SECRET === "string" ? env.AUTH_SECRET : "";
          if (!authSecret) {
            return jsonResponse(
              {
                error: "Authentication service not configured."
              },
              503
            );
          }
          const token = await signJwt(
            {
              id: "env-admin",
              email: configuredEmail,
              role: "admin"
            },
            authSecret
          );
          const cookie = createAuthCookie(token);
          return jsonResponse(
            {
              success: true,
              message: "Logged in successfully",
              user: {
                email: configuredEmail,
                role: "admin"
              }
            },
            200,
            {
              "Set-Cookie": cookie
            }
          );
        } catch {
          return jsonResponse(
            {
              error: "Invalid request"
            },
            400
          );
        }
      }
      if (url.pathname === "/api/auth/me") {
        if (request.method !== "GET") {
          return jsonResponse(
            {
              error: "Method Not Allowed"
            },
            405,
            {
              Allow: "GET"
            }
          );
        }
        const token = getAuthToken(request);
        if (!token) {
          return jsonResponse({
            authenticated: false
          });
        }
        try {
          const authSecret = typeof env.AUTH_SECRET === "string" ? env.AUTH_SECRET : "";
          if (!authSecret) {
            throw new Error(
              "Missing authentication secret"
            );
          }
          const decoded = await verifyJwt(
            token,
            authSecret
          );
          return jsonResponse({
            authenticated: true,
            user: decoded
          });
        } catch {
          return jsonResponse({
            authenticated: false
          });
        }
      }
      if (url.pathname === "/api/auth/logout") {
        if (request.method !== "POST") {
          return jsonResponse(
            {
              error: "Method Not Allowed"
            },
            405,
            {
              Allow: "POST"
            }
          );
        }
        return jsonResponse(
          {
            success: true,
            message: "Logged out successfully"
          },
          200,
          {
            "Set-Cookie": createClearAuthCookie()
          }
        );
      }
      return jsonResponse(
        {
          error: "Not Found API Route"
        },
        404
      );
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
