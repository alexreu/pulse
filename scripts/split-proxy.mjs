/**
 * Reproduit la topologie de Vercel : les routes API et les pages tournent dans
 * des processus distincts, qui ne partagent pas leur mémoire. Un état gardé en
 * mémoire côté serveur y disparaît entre l'écriture et la relecture.
 *
 *   npx next start -p 3201 & npx next start -p 3202 & node scripts/split-proxy.mjs
 *   E2E_BASE_URL=http://127.0.0.1:3200 npm run test:e2e
 */
import http from "node:http";

const API = Number(process.env.API_PORT ?? 3201);
const PAGES = Number(process.env.PAGES_PORT ?? 3202);
const PORT = Number(process.env.PORT ?? 3200);

http.createServer((req, res) => {
  const port = req.url.startsWith("/api/") ? API : PAGES;
  const upstream = http.request({ host: "127.0.0.1", port, path: req.url, method: req.method, headers: req.headers }, (r) => {
    res.writeHead(r.statusCode, r.headers); r.pipe(res);
  });
  upstream.on("error", () => { res.writeHead(502); res.end(); });
  req.pipe(upstream);
}).listen(PORT, () => console.log(`API :${API}, pages :${PAGES}, proxy :${PORT}`));
