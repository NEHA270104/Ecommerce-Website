# Production Security & Architecture Policy

**Application:** Vrishabhanvi Ventures E-Commerce Platform  
**Deployment Target:** GitHub → Netlify → Cloudflare → MongoDB Atlas  
**Classification:** Production Grade  

---

## 1. Deployment Architecture Overview

```
Client Browser
      │
      ▼
Cloudflare (Edge CDN, SSL Termination, DDoS & WAF Rules)
      │
      ▼
Netlify (Global Edge)
  ├── Static SPA Assets (`dist/`) — Cache-Control: public, max-age=31536000
  ├── Security Headers (`netlify.toml`) — CSP, HSTS, XFO, nosniff
  └── Serverless API Functions (`netlify/functions/api.ts`)
            │
            ▼
MongoDB Atlas (M0/Dedicated Cluster with Network Whitelisting)
```

- **Production Routing:**
  - `/api/*` is routed by Netlify directly to the serverless function (`/.netlify/functions/api/:splat`).
  - `/*` routes to `/index.html` for single-page application (SPA) client-side routing.
  - Zero hardcoded external backend URLs in frontend code; all client API calls use relative paths (`/api/...`).

---

## 2. Authentication Architecture

### Credential Handling (`POST /api/auth/login`)
- **Strict Format Validation:** Both email and password are required and validated before any database interaction.
- **Timing Attack Resistance:** When evaluating against environment credentials, string comparison is performed using constant-time cryptographic hash comparison (`crypto.timingSafeEqual`).
- **Cryptographic Hashing:** Stored database passwords use `bcryptjs` with salt factor 10.
- **Enumeration Defense:** Generic error message (`Invalid email or password`) is returned for invalid emails or passwords to prevent account enumeration.
- **Secret Independence:** No fallback default secrets are hardcoded in source code; `AUTH_SECRET` must be supplied via server environment variables.

---

## 3. Authorization Architecture

- **Principle of Least Privilege:** Authentication does not equate to authorization.
- Every endpoint under `/api/admin/*` explicitly verifies:
  1. The existence of a cryptographically valid, unexpired JWT session.
  2. The session payload possesses `role: "admin"`.
- **Status Codes:**
  - `401 Unauthorized`: Missing, expired, malformed, or tampered authentication token.
  - `403 Forbidden`: Authenticated user who does not possess admin privileges (e.g., standard customer role).

---

## 4. Session & Cookie Security

| Directive | Configuration | Rationale |
|---|---|---|
| `HttpOnly` | `true` | Prevents token access from JavaScript, neutralizing XSS credential theft |
| `Secure` | `true` in production | Transmits cookies strictly over encrypted HTTPS connections |
| `SameSite` | `Lax` | Restricts cross-site request transmission, defending against CSRF |
| `Path` | `/` | Confines session context across the complete application scope |
| `Max-Age` | 604800 (7 days) | Session lifecycle limit; cleared with `Max-Age=0` on logout |

*The raw JWT token is never transmitted in the JSON response body to ensure it cannot be stored in `localStorage` or `sessionStorage`.*

---

## 5. API Input Validation & MongoDB Security

### Schema Validation (`server/validators.ts`)
- **Strict Whitelisting:** Product and Category insert endpoints reject or strip unexpected keys.
- **NoSQL Injection Defense:** All incoming JSON request bodies are sanitized via `sanitizeMongoInput()`, which recursively strips keys starting with `$` or containing `.`.
- **Data Constraints:**
  - Price: Numerical value >= 0. Negative prices and invalid types are rejected with HTTP 400.
  - String Length Limits: Enforced on all text fields (names <= 200 chars, descriptions <= 10,000 chars) to prevent resource exhaustion.
  - Status Validation: Order statuses must match strictly allowed enum values (`Placed`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).

### Server-Side Price Verification (`POST /api/orders`)
- E-commerce client-side prices are treated as untrusted suggestions.
- The server verifies item prices against authoritative database records and recalculates subtotal, shipping fee, and grand total server-side.

---

## 6. Security Headers (`netlify.toml`)

- **Content-Security-Policy (CSP):**
  - Restricts script execution to same-origin and Google Tag Manager (`googletagmanager.com`).
  - Restricts stylesheets to same-origin and Google Fonts (`fonts.googleapis.com`).
  - Restricts fonts to same-origin and `fonts.gstatic.com`.
  - Restricts images to same-origin, `images.unsplash.com`, and Google user content.
  - Blocks object embedding (`object-src 'none'`) and clickjacking (`frame-ancestors 'none'`).
- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains; preload`
- **X-Frame-Options:** `DENY`
- **X-Content-Type-Options:** `nosniff`
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Permissions-Policy:** `camera=(), microphone=(), geolocation=(), payment=()`

---

## 7. Rate Limiting & Abuse Defense

- **Sliding Window:** 5 failed attempts allowed per 15-minute window per IP.
- **Distributed Multi-Instance Tracking:** Failed attempts are recorded in the MongoDB Atlas `login_attempts` collection with a 15-minute TTL index (`expireAfterSeconds: 900`).
- **In-Memory Fallback:** Warm serverless instances and local development fall back to memory-based tracking if the database connection is degraded.
- **Lockout Response:** Returns HTTP `429 Too Many Requests` with a `Retry-After` header.

---

## 8. Secrets & Environment Management

- All secrets (`MONGODB_URI`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`) exist strictly in serverless runtime environments and `.env.local`.
- Bundled assets (`dist/assets/*.js`) are scanned during build verification to guarantee zero sensitive variables or database URIs leak into client bundles.
- `.gitignore` ignores `.env`, `.env.local`, and `.env.*.local`, with an explicit exception allowing the `.env.example` template.

---

## 9. Known Limitations & Third-Party Dependencies

- **SheetJS (`xlsx`):** The `xlsx` package has an unpatched community advisory for prototype pollution during workbook parsing. In Vrishabhanvi Ventures, `xlsx` is used exclusively inside the authenticated admin panel for bulk CSV/XLSX template download and product importing. All imported rows are passed through `validateProductInput()` which reconstructs a sanitized product record, preventing prototype injection into database storage.

---

## 10. Production Deployment Checklist

1. **MongoDB Atlas:**
   - Configure Network Access: Add Netlify/Cloudflare IPs or allow all (`0.0.0.0/0`) with strong database user credentials.
   - Run seed script locally if initializing fresh DB: `npm run seed:admin`.
2. **Netlify Dashboard:**
   - Connect repository branch: `main`.
   - Build command: `npm run build`.
   - Publish directory: `dist`.
   - Functions directory: `netlify/functions`.
   - Set Environment Variables:
     - `MONGODB_URI`
     - `AUTH_SECRET` (minimum 32 random characters)
     - `ADMIN_EMAIL`
     - `ADMIN_PASSWORD`
3. **Cloudflare Dashboard:**
   - Proxy DNS records to Netlify.
   - SSL/TLS mode set to **Full (Strict)**.
   - Enable Cloudflare WAF and Bot Fight Mode for DDoS protection.
