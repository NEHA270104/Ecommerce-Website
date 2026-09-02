import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Production Verification Check ===');

// 1. Check title in dist/index.html
const html = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
console.log('1. Browser Title in dist/index.html:', titleMatch ? titleMatch[1] : 'NOT FOUND');
console.log('   Contains Figma Make App:', html.toLowerCase().includes('figma make app'));

// 2. Scan dist assets for secrets
const distAssets = fs.readdirSync(path.join(__dirname, '../dist/assets'));
const jsFiles = distAssets.filter(f => f.endsWith('.js'));
let hasLeak = false;

for (const f of jsFiles) {
  const code = fs.readFileSync(path.join(__dirname, '../dist/assets', f), 'utf8');
  for (const secret of ['Vrishabhanvi@123', 'AUTH_SECRET', 'MONGODB_URI', 'mongodb+srv', 'mongodb.net']) {
    if (code.includes(secret)) {
      console.log(`❌ Leak detected for "${secret}" in asset: ${f}`);
      hasLeak = true;
    }
  }
}

if (!hasLeak) {
  console.log('2. Client Bundle Secret Scan: PASSED (Zero sensitive values in dist bundle)');
}

// 3. Check .gitignore rules
const gitignore = fs.readFileSync(path.join(__dirname, '../.gitignore'), 'utf8');
const rules = ['.env', '.env.local', '.env.*.local'];
const allPresent = rules.every(r => gitignore.includes(r));
console.log('3. .gitignore contains .env, .env.local, .env.*.local:', allPresent ? 'PASSED' : 'FAILED');

// 4. Check Netlify function exists
const functionExists = fs.existsSync(path.join(__dirname, '../netlify/functions/api.ts'));
console.log('4. Netlify serverless function exists (netlify/functions/api.ts):', functionExists ? 'PASSED' : 'FAILED');

// 5. Check netlify.toml exists
const tomlExists = fs.existsSync(path.join(__dirname, '../netlify.toml'));
console.log('5. netlify.toml configuration exists:', tomlExists ? 'PASSED' : 'FAILED');

console.log('====================================');
