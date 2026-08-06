import fs from 'node:fs';
import path from 'node:path';
import { isPathWithinRoot } from './paths.mjs';
/** @param {string} specPath */
export function isLedgerSpecFile(specPath) {
  const n = specPath.replaceAll('\\', '/');
  return /\/e2e\/tests\/ledger\/.+\.spec\.tsx?$/.test(n);
}

/**
 * @param {string} e2eDir
 * @param {string[]} relativePaths
 */
export function resolveE2eExtraModules(e2eDir, relativePaths) {
  const roots = [];
  for (const rel of relativePaths) {
    const abs = path.normalize(path.join(e2eDir, rel));
    if (!isPathWithinRoot(e2eDir, abs)) {
      continue;
    }
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      roots.push(abs);
    }
  }
  return roots;
}
