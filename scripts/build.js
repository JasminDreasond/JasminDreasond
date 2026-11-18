import { copyFile, cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DIST = join(ROOT, 'dist');
const PUBLIC_DIR = join(ROOT, 'public');
const ART_DIR = join(ROOT, 'art-archive');

/** URL prefix that maps to the `art-archive/` folder. */
const ART_PREFIX = '/art-archive/';

/** Extensions scanned for `/art-archive/...` references. */
const SCANNABLE = new Set([
  '.html',
  '.htm',
  '.css',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.webmanifest',
  '.xml',
  '.svg',
  '.txt',
  '.md',
]);

/**
 * Matches `/art-archive/...` up to a character that cannot be part of a URL in
 * HTML/CSS/JS. Parentheses are allowed because real file names use them.
 */
const ART_REF_RE = /\/art-archive\/[^\s"'`<>\\]+/g;

/** Trailing characters that are usually punctuation, not part of the path. */
const TRAILING = new Set(['.', ',', ';', ':', ')', ']', '}', '!', '?']);

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>} Absolute paths of every file below `dir`.
 */
async function walk(dir) {
  /** @type {string[]} */
  const files = [];

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile()) files.push(full);
  }

  return files;
}

/**
 * Collects every `/art-archive/...` URL referenced by the given files.
 *
 * @param {string[]} files
 * @returns {Promise<Set<string>>} URL paths, still encoded, without the query.
 */
async function collectReferences(files) {
  /** @type {Set<string>} */
  const refs = new Set();

  for (const file of files) {
    if (!SCANNABLE.has(file.slice(file.lastIndexOf('.')))) continue;

    const content = await readText(file);
    if (content === null) continue;

    for (const match of content.matchAll(ART_REF_RE)) {
      const url = match[0].split(/[?#]/)[0];
      if (url.length > ART_PREFIX.length) refs.add(url);
    }
  }

  return refs;
}

/**
 * @param {string} file
 * @returns {Promise<string | null>}
 */
async function readText(file) {
  try {
    return await readFile(file, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Resolves a URL path to a real file inside `art-archive/`.
 *
 * Trailing punctuation is trimmed until the path matches a real file, which
 * keeps references inside CSS `url(...)` or prose working.
 *
 * @param {string} urlPath
 * @returns {Promise<string | null>} Absolute path of the referenced file.
 */
async function resolveArtFile(urlPath) {
  let candidate = urlPath;

  while (candidate.length > ART_PREFIX.length) {
    const decoded = safeDecode(candidate);
    if (decoded === null) return null;

    const absolute = resolve(ROOT, `.${decoded}`);

    // Never escape the project root.
    if (!absolute.startsWith(ROOT + sep)) return null;

    if (await exists(absolute)) return absolute;

    const last = candidate.at(-1);
    if (!TRAILING.has(last)) return null;
    candidate = candidate.slice(0, -1);
  }

  return null;
}

/**
 * @param {string} value
 * @returns {string | null}
 */
function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

/**
 * @param {string} label
 * @param {() => Promise<void>} task
 */
async function step(label, task) {
  const started = Date.now();
  await task();
  console.log(`  \u2714 ${label} (${Date.now() - started}ms)`);
}

const allowMissing = process.argv.includes('--allow-missing');

console.log('\n> Building static site...\n');

await step('clean dist/', () => rm(DIST, { recursive: true, force: true }));
await step('create dist/', () => mkdir(DIST, { recursive: true }));
await step('copy public/ -> dist/', () => cp(PUBLIC_DIR, DIST, { recursive: true }));

if (!(await exists(ART_DIR))) {
  console.warn('  ! art-archive/ not found, skipping');
  console.log('\nDone. Output: dist/\n');
  process.exit(0);
}

const publicFiles = await walk(PUBLIC_DIR);
const references = await collectReferences(publicFiles);

/** @type {Map<string, string>} absolute source path -> URL path */
const assets = new Map();
/** @type {string[]} */
const missing = [];

for (const reference of references) {
  const source = await resolveArtFile(reference);
  if (!source) {
    missing.push(reference);
    continue;
  }

  assets.set(source, reference);
}

await step(`copy ${assets.size} referenced file(s) from art-archive/`, async () => {
  for (const source of assets.keys()) {
    const destination = join(DIST, relative(ROOT, source));
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
});

if (missing.length) {
  const label = `\n  ${missing.length} referenced file(s) not found in art-archive/:`;
  console.warn(label);
  for (const item of missing) console.warn(`    - ${item}`);
  console.warn('');

  if (!allowMissing) {
    console.error('Build failed. Fix the paths above or run with --allow-missing.\n');
    process.exit(1);
  }
}

const unused = (await walk(ART_DIR)).length - assets.size;
if (unused > 0) {
  console.log(`  \u2139 ${unused} file(s) in art-archive/ skipped (not referenced)`);
}

console.log('\nDone. Output: dist/\n');
