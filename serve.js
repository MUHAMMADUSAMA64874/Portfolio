import { join, extname } from 'path';

const PORT = 3300;
const DIR = import.meta.dir;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = Bun.serve({
  port: PORT,
  hostname: '0.0.0.0',
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    const safePath = join(DIR, pathname);
    const file = Bun.file(safePath);

    if (await file.exists()) {
      const ext = extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || file.type || 'application/octet-stream';
      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });
    }

    return new Response(`404 Not Found: ${pathname}`, { status: 404 });
  }
});

console.log(`Portfolio server live at: http://127.0.0.1:${PORT}/ and http://localhost:${PORT}/`);
