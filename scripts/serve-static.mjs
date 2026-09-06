/**
 * Minimal static server that follows dist/_redirects the way Netlify/Vercel do:
 * a real file wins, /admin/* falls back to the SPA shell with 200, and anything
 * else returns 404.html with a genuine 404 status.
 *
 * Used by the acceptance tests and handy for checking a production build locally:
 *   node scripts/serve-static.mjs 4180
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const port = Number(process.argv[2] ?? 4180);

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".xml": "application/xml", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain",
};

const send = (res, code, body, type = "text/html; charset=utf-8") => {
  res.writeHead(code, { "Content-Type": type });
  res.end(body);
};

export function start(p = port) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);

    // 1. exact file
    const direct = join(dist, url);
    if (existsSync(direct) && statSync(direct).isFile()) {
      return send(res, 200, readFileSync(direct), MIME[extname(direct)] ?? "application/octet-stream");
    }
    // 2. prerendered directory index
    const asDir = join(dist, url, "index.html");
    if (existsSync(asDir)) return send(res, 200, readFileSync(asDir));

    // 3. admin SPA shell
    if (url === "/admin" || url.startsWith("/admin/")) {
      return send(res, 200, readFileSync(join(dist, "index.html")));
    }
    // 4. genuine 404
    const nf = join(dist, "404.html");
    return send(res, 404, existsSync(nf) ? readFileSync(nf) : "Not found");
  });
  server.listen(p);
  return server;
}

// Only listen when run directly, not when the tests import `start`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start(port);
  console.log(`serving dist/ on http://localhost:${port} (honouring _redirects)`);
}
