'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { getPackageNameForModulePath } = require('@lavamoat/aa');

/**
 * @param {string} p
 * @returns {boolean}
 */
function looksLikeFilesystemPath(p) {
  return (
    path.isAbsolute(p) || p.startsWith(`.${path.sep}`) || p.includes(path.sep)
  );
}

/**
 * Prefer the shortest AA logical path (fewest `>` segments) so duplicates align
 * with the dependency path AA kept when multiple installs exist (yarn/npm).
 *
 * @param {import('@lavamoat/aa').CanonicalNameMap} canonicalNameMap
 * @param {string} npmName
 * @returns {string | undefined}
 */
function findExistingLogicalPathByNpmName(canonicalNameMap, npmName) {
  /** @type {string | undefined} */
  let best;
  /** @type {number} */
  let bestDepth = Infinity;

  for (const dir of canonicalNameMap.keys()) {
    if (typeof dir !== 'string' || dir === path.sep) continue;
    try {
      const pkgPath = path.join(dir, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (!pkg || pkg.name !== npmName) continue;
      const logical = /** @type {string | undefined} */ (
        canonicalNameMap.get(dir)
      );
      if (typeof logical !== 'string') continue;
      const depth = logical.split('>').length;
      if (depth < bestDepth) {
        bestDepth = depth;
        best = logical;
      }
    } catch {
      /* ignore unreadable entries */
    }
  }
  return best;
}

/**
 * @param {string} filePath
 * @returns {string}
 */
function realpathOrNormalized(filePath) {
  try {
    return fs.realpathSync.native
      ? fs.realpathSync.native(filePath)
      : fs.realpathSync(filePath);
  } catch {
    return path.normalize(filePath);
  }
}

/**
 * Like `@lavamoat/aa`’s `getPackageNameForModulePath`, but fills in canonical map
 * entries for duplicate workspace / nested `node_modules` installs that AA
 * skipped because a shorter logical path exists elsewhere.
 *
 * @param {import('@lavamoat/aa').CanonicalNameMap} canonicalNameMap
 * @param {string} modulePathOrRequest
 * @returns {string}
 */
function getPackageNameForModulePathMonorepo(
  canonicalNameMap,
  modulePathOrRequest,
) {
  if (!looksLikeFilesystemPath(modulePathOrRequest)) {
    return getPackageNameForModulePath(canonicalNameMap, modulePathOrRequest);
  }

  const filePath = realpathOrNormalized(modulePathOrRequest);

  try {
    return getPackageNameForModulePath(canonicalNameMap, filePath);
  } catch (err) {
    if (
      !(err instanceof Error) ||
      !err.message.includes('unknown package directory')
    ) {
      throw err;
    }
  }

  let dir = path.dirname(filePath);
  const root = path.parse(dir).root;
  while (dir !== root) {
    const pj = path.join(dir, 'package.json');
    if (fs.existsSync(pj)) {
      const pkgDir = realpathOrNormalized(dir);
      if (canonicalNameMap.has(pkgDir)) {
        return /** @type {string} */ (canonicalNameMap.get(pkgDir));
      }
      const pkg = JSON.parse(fs.readFileSync(pj, 'utf8'));
      const npmName = pkg && pkg.name;
      if (!npmName) {
        break;
      }
      const logical = findExistingLogicalPathByNpmName(
        canonicalNameMap,
        npmName,
      );
      if (logical) {
        canonicalNameMap.set(pkgDir, logical);
        return logical;
      }
      canonicalNameMap.set(pkgDir, npmName);
      return npmName;
    }
    dir = path.dirname(dir);
  }

  return getPackageNameForModulePath(canonicalNameMap, filePath);
}

module.exports = {
  getPackageNameForModulePathMonorepo,
};
