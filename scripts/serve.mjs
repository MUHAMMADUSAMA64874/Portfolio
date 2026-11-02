// Local preview server that mirrors GitHub Pages: the site is served under /Portfolio/.
// Usage: node scripts/serve.mjs   →  http://localhost:3300/Portfolio/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '/Portfolio';
const PORT = Number(process.env.PORT || 3300);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.wasm': 'application/wasm', '.swf': 'application/x-shockwave-flash', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') { res.writeHead(302, { location: BASE + '/' }); return res.end(); }
  if (!p.startsWith(BASE)) { res.writeHead(404); return res.end('Not found'); }
  p = p.slice(BASE.length) || '/';
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  const send = (f, status = 200) => { res.writeHead(status, { 'content-type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' }); fs.createReadStream(f).pipe(res); };
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return send(file);
  send(path.join(ROOT, '404.html'), 404);
}).listen(PORT, () => console.log(`Portfolio: http://localhost:${PORT}${BASE}/`));
