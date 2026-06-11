import fs from 'node:fs';
import path from 'node:path';
export function walkE2eSpecFiles(dir, acc) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkE2eSpecFiles(p, acc);
    } else if (
      ent.name.endsWith('.spec.ts') ||
      ent.name.endsWith('.spec.tsx')
    ) {
      acc.push(p);
    }
  }
}
export function shouldIgnoreAppFile(absPath) {
  const n = absPath.replaceAll('\\', '/');
  if (n.includes('/node_modules/')) {
    return true;
  }
  if (n.includes('/__tests__/')) {
    return true;
  }
  if (/\.(test|spec)\.tsx?$/.test(n)) {
    return true;
  }
  return false;
}

/** @param {string} dir */
export function walkTsFiles(dir, acc, { app } = { app: false }) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (
        ent.name === 'node_modules' ||
        ent.name === 'dist' ||
        ent.name === '.turbo'
      ) {
        continue;
      }
      walkTsFiles(p, acc, { app });
    } else if (/\.tsx?$/.test(ent.name) && !(app && shouldIgnoreAppFile(p))) {
      acc.push(p);
    }
  }
}

/** @param {string} filePath */
export function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
