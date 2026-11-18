import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DIST = join(ROOT, 'dist');
const PUBLIC_DIR = join(ROOT, 'public');
const ART_DIR = join(ROOT, 'art-archive');

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
 * @param {string} label
 * @param {() => Promise<void>} task
 */
async function step(label, task) {
  const started = Date.now();
  await task();
  console.log(`  \u2714 ${label} (${Date.now() - started}ms)`);
}

console.log('\n> Building static site...\n');

await step('clean dist/', () => rm(DIST, { recursive: true, force: true }));
await step('create dist/', () => mkdir(DIST, { recursive: true }));

await step('copy public/ -> dist/', () => cp(PUBLIC_DIR, DIST, { recursive: true }));

if (await exists(ART_DIR)) {
  await step('copy art-archive/ -> dist/art-archive/', () =>
    cp(ART_DIR, join(DIST, 'art-archive'), { recursive: true }),
  );
} else {
  console.warn('  ! art-archive/ not found, skipping');
}

console.log('\nDone. Output: dist/\n');
