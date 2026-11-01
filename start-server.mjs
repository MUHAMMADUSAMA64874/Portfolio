import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3300;
const DIR = 'C:/Users/UsamaPC/Desktop/ai job search/DATA/Portfolio';

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

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    const safePath = path.normalize(path.join(DIR, pathname));
    if (!safePath.startsWith(path.normalize(DIR))) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
      const idx = path.join(safePath, 'index.html');
      if (fs.existsSync(idx)) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        return fs.createReadStream(idx).pipe(res);
      }
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      return fs.createReadStream(safePath).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`404 Not Found: ${pathname}`);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server live at http://localhost:${PORT}/ and http://127.0.0.1:${PORT}/`);
});
