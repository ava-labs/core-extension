import fs from 'node:fs';
import path from 'node:path';
import { isPathWithinRoot } from './paths.mjs';
import { readSource } from './file-io.mjs';
import { createAst, ts } from './typescript-ast.mjs';
/**
 * @param {string} fromFile
 * @param {string} specifier
 * @param {string} e2eRoot
 */
export function resolveE2eRelative(fromFile, specifier, e2eRoot) {
  if (!specifier.startsWith('.')) {
    return null;
  }
  const base = path.resolve(path.dirname(fromFile), specifier);
  const trials = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  for (const p of trials) {
    const norm = path.normalize(p);
    if (!isPathWithinRoot(e2eRoot, norm)) {
      return null;
    }
    if (fs.existsSync(norm) && fs.statSync(norm).isFile()) {
      return norm;
    }
  }
  return null;
}

/**
 * @param {string} entrySpec
 * @param {string} e2eRoot
 * @param {string[]} [extraEntryFiles] Absolute paths under e2eRoot (e.g. shared page objects for ledger specs).
 */
export function transitiveE2eModuleSet(
  entrySpec,
  e2eRoot,
  extraEntryFiles = [],
) {
  const files = new Set();
  const queue = [entrySpec, ...extraEntryFiles];
  while (queue.length) {
    const f = queue.pop();
    if (!f || files.has(f)) {
      continue;
    }
    if (!isPathWithinRoot(e2eRoot, f)) {
      continue;
    }
    if (!fs.existsSync(f)) {
      continue;
    }
    files.add(f);
    const text = readSource(f);
    const sf = createAst(f, text, f.endsWith('tsx'));
    for (const stmt of sf.statements) {
      if (
        !ts.isImportDeclaration(stmt) ||
        !stmt.moduleSpecifier ||
        !ts.isStringLiteral(stmt.moduleSpecifier)
      ) {
        continue;
      }
      const spec = stmt.moduleSpecifier.text;
      const resolved = resolveE2eRelative(f, spec, e2eRoot);
      if (resolved) {
        queue.push(resolved);
      }
    }
  }
  return files;
}
