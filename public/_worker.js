// A simple HS256 JWT implementation using Web Crypto API to avoid Node.js dependencies
function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeBuffer(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

async function signJwt(payload, secret) {
  const enc = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }));
  
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const encodedSignature = base64UrlEncodeBuffer(signature);
  
  return `${data}.${encodedSignature}`;
}

async function verifyJwt(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  const signatureBytes = new Uint8Array(
    atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'))
      .split('')
      .map(c => c.charCodeAt(0))
  );
  
  const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, enc.encode(data));
  if (!isValid) throw new Error('Invalid signature');
  
  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }
  
  return payload;
}

// Constant-time comparison
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= (a.charCodeAt(i) ^ b.charCodeAt(i));
  }
  return mismatch === 0;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const AUTH_COOKIE_NAME = "vv_admin_token";

    // 1. POST /api/auth/login
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const email = (body.email || "").trim().toLowerCase();
        const password = (body.password || "");

        const envEmail = env.ADMIN_EMAIL ? env.ADMIN_EMAIL.trim().toLowerCase() : "";
        const envPassword = env.ADMIN_PASSWORD ? env.ADMIN_PASSWORD.trim() : "";

        if (!envEmail || !envPassword) {
          return new Response(JSON.stringify({ error: "Authentication service not configured." }), {
            status: 503,
            headers: { "Content-Type": "application/json" }
          });
        }

        const emailMatches = safeCompare(email, envEmail);
        const passwordMatches = safeCompare(password, envPassword);

        if (!emailMatches || !passwordMatches) {
          return new Response(JSON.stringify({ error: "Invalid email or password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }

        const authSecret = env.AUTH_SECRET;
        if (!authSecret) {
          return new Response(JSON.stringify({ error: "AUTH_SECRET is missing." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const tokenPayload = { id: "env-admin", email: envEmail, role: "admin" };
        const token = await signJwt(tokenPayload, authSecret);
        
        const setCookieStr = `${AUTH_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`;

        return new Response(
          JSON.stringify({
            success: true,
            message: "Logged in successfully",
            user: { email: envEmail, role: "admin" }
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": setCookieStr
            }
          }
        );
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
      }
    }

    // 2. GET /api/auth/me
    if (url.pathname === "/api/auth/me" && request.method === "GET") {
      const cookieHeader = request.headers.get("Cookie") || "";
      const match = cookieHeader.match(new RegExp(`(^| )${AUTH_COOKIE_NAME}=([^;]+)`));
      const token = match ? match[2] : null;

      if (!token) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      try {
        const authSecret = env.AUTH_SECRET;
        if (!authSecret) throw new Error("Missing secret");
        
        const decoded = await verifyJwt(token, authSecret);
        return new Response(JSON.stringify({
          authenticated: true,
          user: decoded
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 3. POST /api/auth/logout
    if (url.pathname === "/api/auth/logout" && request.method === "POST") {
      const clearCookieStr = `${AUTH_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
      return new Response(
        JSON.stringify({ success: true, message: "Logged out successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": clearCookieStr
          }
        }
      );
    }

    // Pass-through everything else to static assets
    return env.ASSETS.fetch(request);
  }
};
