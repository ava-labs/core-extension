import { AMBIGUOUS_FEATURE_DIRS } from './constants.mjs';
import { featureDirMatchTokens } from './typescript-ast.mjs';
/**
 * Shared "swap" token can match both `pages/Fusion` and `pages/Swap`; drop Fusion unless the spec hints at fusion swap.
 * @param {Set<string>} dirs
 * @param {string[]} corpusParts
 */
export function dedupeFusionSwapFolders(dirs, corpusParts) {
  const c = corpusParts.join(' ').toLowerCase();
  if (dirs.has('Fusion') && dirs.has('Swap')) {
    const fusionHint =
      /\bfusion\b/.test(c) ||
      /\bjupiter\b/.test(c) ||
      /\bparaswap\b/i.test(c) ||
      /\bmarkr\b/i.test(c);
    if (!fusionHint) {
      dirs.delete('Fusion');
    }
  }
}

/**
 * Extension UI: network management lives under `pages/Settings`, but specs often mention “Portfolio”.
 * Onboarding specs can spuriously match `KeystoneUsb` from unrelated copy.
 * @param {string} specAbsPath
 * @param {string} specText
 * @param {Set<string>} matchedFeatureDirs
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 */
export function refinePagesFolderMatchesForExtension(
  specAbsPath,
  specText,
  matchedFeatureDirs,
  featureToTestIds,
) {
  const rel = specAbsPath.replaceAll('\\', '/');
  const fullLower = specText.toLowerCase();

  if (
    /networks\.spec\.(ts|tsx)$/.test(rel) ||
    /\bnetworkspage\b/i.test(fullLower)
  ) {
    matchedFeatureDirs.delete('Portfolio');
    if (featureToTestIds.has('Settings')) {
      matchedFeatureDirs.add('Settings');
    }
  }

  if (
    /onboarding\.spec\.(ts|tsx)$/.test(rel) ||
    /analytics\.spec\.(ts|tsx)$/.test(rel)
  ) {
    matchedFeatureDirs.delete('KeystoneUsb');
  }
}

/**
 * Match feature folders to spec text. `minTokenLen` avoids short tokens ("swap") matching many dirs on long corpora.
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 * @param {string[]} corpusParts
 * @param {{ minTokenLen?: number }} [opts]
 */
export function inferMatchedFeatureDirs(
  featureToTestIds,
  corpusParts,
  opts = {},
) {
  const minTokenLen = opts.minTokenLen ?? 4;
  const corpus = corpusParts.join(' ').toLowerCase();
  const matched = new Set();
  for (const dir of featureToTestIds.keys()) {
    if (AMBIGUOUS_FEATURE_DIRS.has(dir)) {
      continue;
    }
    const dirLower = dir.toLowerCase();
    if (dirLower.length >= 8 && corpus.includes(dirLower)) {
      matched.add(dir);
      continue;
    }
    for (const tok of featureDirMatchTokens(dir)) {
      if (tok.length < minTokenLen) {
        continue;
      }
      try {
        const re = new RegExp(
          `\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
          'i',
        );
        if (re.test(corpus)) {
          matched.add(dir);
          break;
        }
      } catch {}
    }
  }
  return matched;
}

/**
 * @param {Map<string, { statics: Set<string>, globs: Set<string> }>} featureToTestIds
 * @param {Set<string>} featureDirs
 */
export function mergeAttributedTestIds(featureToTestIds, featureDirs) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  for (const d of featureDirs) {
    const b = featureToTestIds.get(d);
    if (!b) {
      continue;
    }
    for (const s of b.statics) {
      out.statics.add(s);
    }
    for (const g of b.globs) {
      out.globs.add(g);
    }
  }
  return out;
}
