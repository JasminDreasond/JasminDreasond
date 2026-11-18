import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sirv from 'sirv';

/** @type {string} */
const __dirname = dirname(fileURLToPath(import.meta.url));
/** @type {string} */
const ROOT = join(__dirname, '..');

/** @type {number} */
const PORT = Number(process.env.PORT) || 4000;

/**
 * `--dist` serves the production build (dist/) instead of the sources.
 * @type {boolean}
 */
const USE_DIST = process.argv.includes('--dist');

/**
 * Wraps a sirv handler so it only answers for `prefix`, leaving every other
 * request to the next route in the chain.
 *
 * @param {string} prefix URL prefix, or an empty string to match everything.
 * @param {string} dir Absolute path of the directory to expose.
 * @returns {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, next: () => void) => void}
 */
function serveDir(prefix, dir) {
  const handler = sirv(dir, { dev: !USE_DIST, etag: true });

  return (req, res, next) => {
    const url = req.url || '/';
    if (prefix && url !== prefix && !url.startsWith(`${prefix}/`)) return next();

    req.url = url.slice(prefix.length) || '/';
    handler(req, res, () => {
      req.url = url;
      next();
    });
  };
}

/**
 * @param {import('node:http').ServerResponse} res
 */
function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('404 Not Found');
}

/**
 * In development `public/` is the website root and `art-archive/` is mounted on
 * top of it. In production the build step already merged both into `dist/`.
 */
const routes = USE_DIST
  ? [serveDir('', join(ROOT, 'dist'))]
  : [
      serveDir('/art-archive', join(ROOT, 'art-archive')),
      serveDir('', join(ROOT, 'public')),
    ];

createServer((req, res) => {
  let index = 0;

  const next = () => {
    const route = routes[index++];
    if (!route) return notFound(res);
    route(req, res, next);
  };

  next();
}).listen(PORT, () => {
  const mode = USE_DIST ? 'dist' : 'public';
  console.log(`[TEST APP] Running at http://localhost:${PORT} (${mode})`);
});
