import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Monorepo root: from e2e/scripts/coverage, three levels up. */
export const REPO_ROOT = path.resolve(__dirname, '../../..');
export function defaultAppRoots() {
  const candidates = [path.join(REPO_ROOT, 'apps/next/src')];
  return candidates.filter((p) => fs.existsSync(p));
}

/** Top-level product folders under the Next app (parallel to core-web `apps/core/app/components/*`). */
export function featureAreasRoot() {
  return path.normalize(path.join(REPO_ROOT, 'apps/next/src/pages'));
}

/**
 * True when `candidatePath` is the same as or under `rootDir` (resolved), without `startsWith` prefix false-positives.
 * @param {string} rootDir
 * @param {string} candidatePath
 */
export function isPathWithinRoot(rootDir, candidatePath) {
  const rootResolved = path.resolve(rootDir);
  const candidateResolved = path.resolve(candidatePath);
  const relative = path.relative(rootResolved, candidateResolved);
  return (
    relative === '' ||
    (relative !== '..' &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  );
}
