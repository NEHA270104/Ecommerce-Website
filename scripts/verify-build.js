import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Production Verification Check (GitHub -> Netlify -> Cloudflare -> MongoDB Atlas) ===\n');

let failed = false;

// 1. Check title in dist/index.html
const htmlPath = path.join(__dirname, '../dist/index.html');
if (!fs.existsSync(htmlPath)) {
  console.log('❌ dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
const title = titleMatch ? titleMatch[1] : '';
const containsFigma = html.toLowerCase().includes('figma make app');

console.log(`1. Browser Title in dist/index.html: "${title}"`);
if (title.includes('Vrishabhanvi') && !containsFigma) {
  console.log('   ✅ Title Verification: PASSED');
} else {
  console.log('   ❌ Title Verification: FAILED (Title contains placeholder or misses brand name)');
  failed = true;
}

// 2. Scan dist assets for secrets
const distAssetsPath = path.join(__dirname, '../dist/assets');
const distAssets = fs.existsSync(distAssetsPath) ? fs.readdirSync(distAssetsPath) : [];
const jsFiles = distAssets.filter(f => f.endsWith('.js'));
let hasSecretLeak = false;

const sensitivePatterns = [
  'MONGODB_URI',
  'mongodb+srv',
  'mongodb.net',
  'AUTH_SECRET',
  'ADMIN_PASSWORD',
  'Vrishabhanvi@123',
  'vv_jwt_default_secret',
  'onrender.com'
];

for (const f of jsFiles) {
  const code = fs.readFileSync(path.join(distAssetsPath, f), 'utf8');
  for (const secret of sensitivePatterns) {
    if (code.includes(secret)) {
      console.log(`   ❌ Leak detected for "${secret}" in client bundle: ${f}`);
      hasSecretLeak = true;
      failed = true;
    }
  }
}

if (!hasSecretLeak) {
  console.log('2. Client Bundle Secret Scan: PASSED (Zero sensitive values in dist bundle)');
}

// 3. Check .gitignore rules
const gitignore = fs.readFileSync(path.join(__dirname, '../.gitignore'), 'utf8');
const requiredRules = ['.env', '.env.local', '.env.*.local', '!.env.example'];
const allPresent = requiredRules.every(r => gitignore.includes(r));
if (allPresent) {
  console.log('3. .gitignore contains .env, .env.local, .env.*.local and !.env.example: PASSED');
} else {
  console.log('3. .gitignore missing required entries: FAILED');
  failed = true;
}

// 4. Check Netlify serverless function exists
const functionPath = path.join(__dirname, '../netlify/functions/api.ts');
const functionExists = fs.existsSync(functionPath);
if (functionExists) {
  console.log('4. Netlify serverless function exists (netlify/functions/api.ts): PASSED');
} else {
  console.log('4. Netlify serverless function exists: FAILED');
  failed = true;
}

// 5. Check netlify.toml exists and contains required routes and headers
const tomlPath = path.join(__dirname, '../netlify.toml');
const tomlExists = fs.existsSync(tomlPath);
if (tomlExists) {
  const tomlContent = fs.readFileSync(tomlPath, 'utf8');
  const hasApiRedirect = tomlContent.includes('/api/*') && tomlContent.includes('/.netlify/functions/api/:splat');
  const hasSpaRedirect = tomlContent.includes('/*') && tomlContent.includes('/index.html');
  const hasCsp = tomlContent.includes('Content-Security-Policy');
  const hasXfo = tomlContent.includes('X-Frame-Options');

  if (hasApiRedirect && hasSpaRedirect && hasCsp && hasXfo) {
    console.log('5. netlify.toml configuration & security headers: PASSED');
  } else {
    console.log('5. netlify.toml is missing required redirects or headers: FAILED');
    failed = true;
  }
} else {
  console.log('5. netlify.toml does not exist: FAILED');
  failed = true;
}

// 6. Check frontend API helper
const apiHelperPath = path.join(__dirname, '../src/lib/api.ts');
if (fs.existsSync(apiHelperPath)) {
  const apiCode = fs.readFileSync(apiHelperPath, 'utf8');
  if (apiCode.includes('onrender.com')) {
    console.log('6. Frontend API helper (src/lib/api.ts) contains hardcoded backend URL: FAILED');
    failed = true;
  } else {
    console.log('6. Frontend API helper (src/lib/api.ts) clean: PASSED');
  }
} else {
  console.log('6. Frontend API helper missing: FAILED');
  failed = true;
}

console.log('\n================================================================');
if (failed) {
  console.error('❌ Production Verification FAILED. Please resolve issues above.');
  process.exit(1);
} else {
  console.log('✅ Production Verification PASSED. Application is hardened for Netlify + Cloudflare.');
  process.exit(0);
}
