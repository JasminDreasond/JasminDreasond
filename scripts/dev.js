import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join } from 'node:path';
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

/** Root folder being served, used to resolve the 404 page. */
const SITE_DIR = join(ROOT, USE_DIST ? 'dist' : 'public');

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
 * @param {string} body
 */
function sendText(res, body) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(body);
}

/**
 * Serves `404.html` for page navigations and a plain text body for assets, so a
 * missing image does not return an HTML document. The status is always 404.
 *
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function notFound(req, res) {
  const url = (req.url || '/').split(/[?#]/)[0];
  const acceptsHtml = (req.headers.accept || '').includes('text/html');

  // Only browsers navigating to a page get the HTML page. A missing asset must
  // keep failing as an asset, otherwise the browser tries to decode HTML as an
  // image/script/stylesheet.
  if (!acceptsHtml && extname(url) !== '') return sendText(res, '404 Not Found');

  const file = join(SITE_DIR, '404.html');

  let size;
  try {
    ({ size } = await stat(file));
  } catch {
    return sendText(res, '404 Not Found');
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Length', size);
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'HEAD') return res.end();

  const stream = createReadStream(file);
  stream.on('error', () => res.destroy());
  stream.pipe(res);
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
    if (!route) return void notFound(req, res);
    route(req, res, next);
  };

  next();
}).listen(PORT, () => {
  const mode = USE_DIST ? 'dist' : 'public';
  console.log(`[TEST APP] Running at http://localhost:${PORT} (${mode})`);
});
