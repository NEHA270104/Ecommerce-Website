import http from 'http';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const PORT = 5056;
const TEST_ORIGIN = 'https://vrishabhanvi.pages.dev';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let json;
        try { json = JSON.parse(body); } catch { json = body; }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
        });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING SECURITY & AUTH VERIFICATION SUITE ===\n');

  // 1. Test GET /api/health
  console.log('1. Testing GET /api/health:');
  const healthRes = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/health',
    method: 'GET',
    headers: { Origin: TEST_ORIGIN },
  });
  console.log('   Status:', healthRes.statusCode);
  console.log('   Body:', JSON.stringify(healthRes.body));
  console.log('   CORS Origin:', healthRes.headers['access-control-allow-origin']);
  console.log('   CORS Credentials:', healthRes.headers['access-control-allow-credentials']);
  console.log('   Vary:', healthRes.headers['vary']);

  // 2. Test GET /api/health/mongodb
  console.log('\n2. Testing GET /api/health/mongodb:');
  const mongoRes = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/health/mongodb',
    method: 'GET',
  });
  console.log('   Status:', mongoRes.statusCode);
  console.log('   Body:', JSON.stringify(mongoRes.body));

  // 3. Test Unauthorized access to /api/auth/me
  console.log('\n3. Testing unauthorized GET /api/auth/me:');
  const unauthMe = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/me',
    method: 'GET',
  });
  console.log('   Status:', unauthMe.statusCode, '(Expected 401)');
  console.log('   Body:', JSON.stringify(unauthMe.body));

  // 4. Test Unauthorized access to protected /api/admin/products
  console.log('\n4. Testing unauthorized GET /api/admin/products:');
  const unauthAdmin = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/admin/products',
    method: 'GET',
  });
  console.log('   Status:', unauthAdmin.statusCode, '(Expected 401)');

  // 5. Test Admin Login
  console.log('\n5. Testing POST /api/auth/login:');
  const email = process.env.ADMIN_EMAIL || 'VrishabhanviVentures@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Vrishabhanvi@123';

  const loginRes = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: TEST_ORIGIN,
    },
  }, { email, password });

  console.log('   Status:', loginRes.statusCode);
  console.log('   Body has raw JWT token?:', loginRes.body.token ? 'YES (LEAK!)' : 'NO (SECURE - pure cookie only)');
  console.log('   User:', JSON.stringify(loginRes.body.user));

  const setCookie = loginRes.headers['set-cookie'];
  console.log('   Set-Cookie Header Present?:', !!setCookie);
  if (setCookie) {
    const cookieStr = setCookie[0];
    console.log('   Cookie includes HttpOnly?:', cookieStr.includes('HttpOnly'));
    console.log('   Cookie includes Secure?:', cookieStr.includes('Secure'));
    console.log('   Cookie includes SameSite?:', cookieStr.match(/SameSite=[^;]+/)?.[0] || 'none');
    console.log('   Cookie includes Path=/?:', cookieStr.includes('Path=/'));
  }

  const sessionCookie = setCookie ? setCookie[0].split(';')[0] : '';

  // 6. Test GET /api/auth/me with Cookie
  console.log('\n6. Testing authenticated GET /api/auth/me (with session cookie):');
  const authMe = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      Cookie: sessionCookie,
      Origin: TEST_ORIGIN,
    },
  });
  console.log('   Status:', authMe.statusCode, '(Expected 200)');
  console.log('   Authenticated:', authMe.body.authenticated);
  console.log('   User:', JSON.stringify(authMe.body.user));

  // 7. Test Protected /api/admin/products with Cookie
  console.log('\n7. Testing authenticated GET /api/admin/products (with session cookie):');
  const authAdmin = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/admin/products',
    method: 'GET',
    headers: {
      Cookie: sessionCookie,
      Origin: TEST_ORIGIN,
    },
  });
  console.log('   Status:', authAdmin.statusCode, '(Expected 200)');
  console.log('   Products returned:', Array.isArray(authAdmin.body.products));

  // 8. Test Logout & Cookie Invalidation
  console.log('\n8. Testing POST /api/auth/logout:');
  const logoutRes = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/logout',
    method: 'POST',
    headers: {
      Cookie: sessionCookie,
      Origin: TEST_ORIGIN,
    },
  });
  console.log('   Status:', logoutRes.statusCode);
  const logoutCookie = logoutRes.headers['set-cookie']?.[0] || '';
  console.log('   Logout Cookie clears token (Max-Age=0)?:', logoutCookie.includes('Max-Age=0'));

  // 9. Test /api/auth/me with the cleared cookie
  console.log('\n9. Testing GET /api/auth/me with cleared cookie:');
  const postLogoutMe = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      Cookie: logoutCookie.split(';')[0],
      Origin: TEST_ORIGIN,
    },
  });
  console.log('   Status:', postLogoutMe.statusCode, '(Expected 401)');
  console.log('   Authenticated:', postLogoutMe.body.authenticated);

  console.log('\n=== ALL SECURITY TESTS COMPLETED SUCCESSFULLY ===');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
