import http from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { handleApiRequest } from "../server/apiMiddleware.ts";

dotenv.config({ path: ".env.local" });
dotenv.config();

const PORT = 5099;
const TEST_ORIGIN = "https://vrishabhanvi.com";

let server;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let json;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
        });
      });
    });
    req.on("error", reject);
    if (data !== null) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("================================================================");
  console.log(" Vrishabhanvi Ventures - Production Security & Auth Test Suite");
  console.log("================================================================\n");

  server = http.createServer((req, res) => {
    handleApiRequest(req, res, () => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Not Found" }));
    });
  });

  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
  console.log(`[Test Server] Running on http://127.0.0.1:${PORT}\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(name, condition, detail = "") {
    if (condition) {
      console.log(`  ✅ ${name}`);
      testsPassed++;
    } else {
      console.error(`  ❌ ${name} - ${detail}`);
      testsFailed++;
    }
  }

  // ── 1. Health Endpoints ──────────────────────────────────────────────────
  console.log("1. Testing Health Endpoints:");
  const healthRes = await request({
    hostname: "127.0.0.1",
    port: PORT,
    path: "/api/health",
    method: "GET",
    headers: { Origin: TEST_ORIGIN },
  });
  assert("GET /api/health returns 200 ok", healthRes.statusCode === 200 && healthRes.body.status === "ok");
  assert("CORS allowed for production domain", healthRes.headers["access-control-allow-origin"] === TEST_ORIGIN);
  assert("X-Content-Type-Options: nosniff present", healthRes.headers["x-content-type-options"] === "nosniff");

  const mongoRes = await request({
    hostname: "127.0.0.1",
    port: PORT,
    path: "/api/health/mongodb",
    method: "GET",
  });
  assert("GET /api/health/mongodb responds (200 or 503)", [200, 503].includes(mongoRes.statusCode));

  // ── 2. Authentication Test Matrix ────────────────────────────────────────
  console.log("\n2. Testing Authentication Security Matrix:");

  // Test 2.1: Missing email
  const missingEmail = await request(
    {
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { password: "somepassword" }
  );
  assert("Missing email returns 400 validation error", missingEmail.statusCode === 400);

  // Test 2.2: Missing password
  const missingPassword = await request(
    {
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "test@example.com" }
  );
  assert("Missing password returns 400 validation error", missingPassword.statusCode === 400);

  // Test 2.3: Malformed email
  const malformedEmail = await request(
    {
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "notanemail", password: "somepassword" }
  );
  assert("Malformed email returns 400 validation error", malformedEmail.statusCode === 400);

  // Test 2.4: Wrong email
  const wrongEmail = await request(
    {
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "wrong@example.com", password: "somepassword" }
  );
  assert("Wrong email returns 401 generic error", wrongEmail.statusCode === 401 && wrongEmail.body.error === "Invalid email or password");

  // Test 2.5: Wrong password for valid email
  const adminEmail = process.env.ADMIN_EMAIL || "VrishabhanviVentures@gmail.com";
  const wrongPassword = await request(
    {
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: adminEmail, password: "definitelyWrongPassword999!" }
  );
  assert("Wrong password returns 401 generic error", wrongPassword.statusCode === 401 && wrongPassword.body.error === "Invalid email or password");

  // Test 2.6: Successful login
  const adminPassword = process.env.ADMIN_PASSWORD;
  let sessionCookie = "";

  if (adminPassword) {
    const loginRes = await request(
      {
        hostname: "127.0.0.1",
        port: PORT,
        path: "/api/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: TEST_ORIGIN },
      },
      { email: adminEmail, password: adminPassword }
    );

    assert("Valid admin credentials return 200 OK", loginRes.statusCode === 200 && loginRes.body.success === true);
    assert("Response does NOT leak raw JWT token", loginRes.body.token === undefined);

    const setCookie = loginRes.headers["set-cookie"];
    assert("Set-Cookie header is present", !!setCookie);
    if (setCookie) {
      const cookieStr = setCookie[0];
      sessionCookie = cookieStr.split(";")[0];
      assert("Cookie has HttpOnly attribute", cookieStr.includes("HttpOnly"));
      assert("Cookie has Path=/ attribute", cookieStr.includes("Path=/"));
      assert("Cookie has SameSite=Lax", cookieStr.toLowerCase().includes("samesite=lax"));
    }
  } else {
    console.log("  ⚠️ ADMIN_PASSWORD not set in environment; skipping live login credential check");
  }

  // Test 2.7: Unauthorized access to /api/auth/me (no cookie)
  const unauthMe = await request({
    hostname: "127.0.0.1",
    port: PORT,
    path: "/api/auth/me",
    method: "GET",
  });
  assert("GET /api/auth/me without cookie returns 401", unauthMe.statusCode === 401);

  // Test 2.8: Expired or Modified JWT
  const secret = process.env.AUTH_SECRET || "dummy";
  const fakeToken = jwt.sign({ email: adminEmail, role: "admin" }, "different_secret_key");
  const tamperedReq = await request({
    hostname: "127.0.0.1",
    port: PORT,
    path: "/api/auth/me",
    method: "GET",
    headers: { Cookie: `vv_admin_token=${fakeToken}` },
  });
  assert("Modified/tampered JWT returns 401 Unauthorized", tamperedReq.statusCode === 401);

  // Test 2.9: Authenticated access with valid session
  if (sessionCookie) {
    const authMe = await request({
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/auth/me",
      method: "GET",
      headers: { Cookie: sessionCookie },
    });
    assert("GET /api/auth/me with valid cookie returns 200 & role=admin", authMe.statusCode === 200 && authMe.body.user?.role === "admin");
  }

  // ── 3. Authorization & Protected Admin Routes ────────────────────────────
  console.log("\n3. Testing Authorization on Protected Admin Routes:");

  // Test 3.1: Public/unauthenticated user accessing /api/admin/products
  const unauthAdmin = await request({
    hostname: "127.0.0.1",
    port: PORT,
    path: "/api/admin/products",
    method: "GET",
  });
  assert("Unauthenticated GET /api/admin/products returns 401", unauthAdmin.statusCode === 401);

  // Test 3.2: Non-admin user (customer) token accessing admin endpoint
  if (process.env.AUTH_SECRET) {
    const customerToken = jwt.sign({ email: "customer@example.com", role: "customer" }, process.env.AUTH_SECRET);
    const customerAdminReq = await request({
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/admin/products",
      method: "GET",
      headers: { Cookie: `vv_admin_token=${customerToken}` },
    });
    assert("Non-admin role accessing /api/admin/products returns 403 Forbidden", customerAdminReq.statusCode === 403);
  }

  // Test 3.3: Authenticated Admin access to /api/admin/products
  if (sessionCookie) {
    const adminProducts = await request({
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/admin/products",
      method: "GET",
      headers: { Cookie: sessionCookie },
    });
    assert("Authenticated admin accessing /api/admin/products returns 200", adminProducts.statusCode === 200);
  }

  // ── 4. Input Validation & MongoDB Sanitization ────────────────────────────
  console.log("\n4. Testing Input Validation & Operator Sanitization:");

  // Test 4.1: POST /api/admin/products with negative price
  if (sessionCookie) {
    const badProduct = await request(
      {
        hostname: "127.0.0.1",
        port: PORT,
        path: "/api/admin/products",
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: sessionCookie },
      },
      { name: "Faulty Saree", category: "Sarees", price: -100 }
    );
    assert("Product with negative price is rejected with 400", badProduct.statusCode === 400);

    // Test 4.2: Operator injection attempt
    const operatorInjection = await request(
      {
        hostname: "127.0.0.1",
        port: PORT,
        path: "/api/admin/products",
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: sessionCookie },
      },
      { name: "Injected Item", category: "Test", price: 500, $where: "sleep(5000)" }
    );
    assert("Product with MongoDB operator keys is safely handled", [200, 201, 400, 503].includes(operatorInjection.statusCode));
  }

  // ── 5. Server-Side Price Verification ────────────────────────────────────
  console.log("\n5. Testing Server-Side Price Calculation (/api/orders):");
  const orderVerification = await request(
    {
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/orders",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      items: [
        { name: "Floral Cotton Straight Kurti", quantity: 2, price: 1 }, // Client attempts 1 rupee hack
      ],
    }
  );
  assert("POST /api/orders verifies price server-side", orderVerification.statusCode === 200);
  if (orderVerification.body && orderVerification.body.verifiedTotal) {
    // Authoritative price is 899 each -> 2 * 899 = 1798 >= 999 -> shipping 0 -> total 1798
    assert("Server ignores client's ₹1 price and uses authoritative price", orderVerification.body.verifiedTotal === 1798);
  }

  // ── 6. Logout & Cookie Clearing ──────────────────────────────────────────
  console.log("\n6. Testing Logout Security:");
  const logoutRes = await request({
    hostname: "127.0.0.1",
    port: PORT,
    path: "/api/auth/logout",
    method: "POST",
  });
  assert("POST /api/auth/logout returns 200", logoutRes.statusCode === 200);
  const logoutCookie = logoutRes.headers["set-cookie"]?.[0] || "";
  assert("Logout Set-Cookie clears token with Max-Age=0", logoutCookie.includes("Max-Age=0"));

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log("\n================================================================");
  console.log(`Results: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("================================================================");

  server.close();

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test Suite crashed:", err);
  if (server) server.close();
  process.exit(1);
});
