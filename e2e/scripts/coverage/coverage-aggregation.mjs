import { globToRegExp } from './typescript-ast.mjs';
/**
 * @param {string} e2eId
 * @param {{ statics: Set<string>, globs: Set<string> }} app
 */
export function appDefinesTestId(e2eId, app) {
  if (app.statics.has(e2eId)) {
    return true;
  }
  for (const g of app.globs) {
    if (globToRegExp(g).test(e2eId)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} appId
 * @param {{ statics: Set<string>, globs: Set<string> }} e2e
 */
export function e2eTouchesAppStaticId(appStaticId, e2e) {
  if (e2e.statics.has(appStaticId)) {
    return true;
  }
  for (const eg of e2e.globs) {
    if (globToRegExp(eg).test(appStaticId)) {
      return true;
    }
  }
  return false;
}

/**
 * App-side template bucket `foo-*-bar` is covered if some concrete e2e string matches it.
 * @param {string} appGlob
 * @param {{ statics: Set<string>, globs: Set<string> }} e2e
 */
export function appPatternTouchedByE2e(appGlob, e2e) {
  const re = globToRegExp(appGlob);
  for (const s of e2e.statics) {
    if (re.test(s)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {{ statics: Set<string>, globs: Set<string> }} appIds
 * @param {{ statics: Set<string>, globs: Set<string> }} e2e
 */
export function partitionAppCoverage(appIds, e2e) {
  const coveredStatics = [];
  const uncoveredStatics = [];
  for (const id of appIds.statics) {
    if (e2eTouchesAppStaticId(id, e2e)) {
      coveredStatics.push(id);
    } else {
      uncoveredStatics.push(id);
    }
  }
  const coveredGlobs = [];
  const uncoveredGlobs = [];
  for (const g of appIds.globs) {
    if (appPatternTouchedByE2e(g, e2e)) {
      coveredGlobs.push(g);
    } else {
      uncoveredGlobs.push(g);
    }
  }
  const denominator = appIds.statics.size + appIds.globs.size;
  const numerator = coveredStatics.length + coveredGlobs.length;
  return {
    coveredStatics,
    uncoveredStatics,
    coveredGlobs,
    uncoveredGlobs,
    numerator,
    denominator,
  };
}

/**
 * % of top-level `apps/next/src/pages/<Name>` folders that declare at least one testid and are "hit" by global e2e.
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 * @param {{ statics: Set<string>, globs: Set<string> }} globalE2e
 */
export function computeComponentFeatureFolderCoverage(
  featureToTestIds,
  globalE2e,
) {
  const totalTopLevelFolders = featureToTestIds.size;
  let foldersWithDeclaredTestIds = 0;
  let foldersTouchedByE2e = 0;
  /** @type {string[]} */
  const uncoveredFolders = [];
  for (const [dir, bucket] of featureToTestIds) {
    if (bucket.statics.size === 0 && bucket.globs.size === 0) {
      continue;
    }
    foldersWithDeclaredTestIds++;
    let hit = false;
    for (const id of bucket.statics) {
      if (e2eTouchesAppStaticId(id, globalE2e)) {
        hit = true;
        break;
      }
    }
    if (!hit) {
      for (const g of bucket.globs) {
        if (appPatternTouchedByE2e(g, globalE2e)) {
          hit = true;
          break;
        }
      }
    }
    if (hit) {
      foldersTouchedByE2e++;
    } else {
      uncoveredFolders.push(dir);
    }
  }
  const pctAmongDeclared =
    foldersWithDeclaredTestIds === 0
      ? 0
      : (foldersTouchedByE2e / foldersWithDeclaredTestIds) * 100;
  const foldersWithNoTestIdsDeclared =
    totalTopLevelFolders - foldersWithDeclaredTestIds;
  const pctOfAllAppAreasWithTestIds =
    totalTopLevelFolders === 0
      ? 0
      : (foldersWithDeclaredTestIds / totalTopLevelFolders) * 100;
  const pctOfAllAppAreasTouchedByE2e =
    totalTopLevelFolders === 0
      ? 0
      : (foldersTouchedByE2e / totalTopLevelFolders) * 100;
  return {
    totalTopLevelFolders,
    foldersWithDeclaredTestIds,
    foldersWithNoTestIdsDeclared,
    foldersTouchedByE2e,
    percentAmongFoldersWithTestIds: Math.round(pctAmongDeclared * 100) / 100,
    percentOfAllComponentAreasWithDeclaredTestIds:
      Math.round(pctOfAllAppAreasWithTestIds * 100) / 100,
    percentOfAllComponentAreasTouchedByE2e:
      Math.round(pctOfAllAppAreasTouchedByE2e * 100) / 100,
    uncoveredFoldersWithTestIds: uncoveredFolders.sort(),
  };
}

export function filterIgnoredOrphans(ids, ignored) {
  const ig = new Set(ignored);
  return ids.filter((id) => !ig.has(id));
}
