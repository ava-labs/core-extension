/**
 * E2E feature coverage report — see ../e2e-testid-coverage.mjs for product overview.
 */
import path from 'node:path';
import process from 'node:process';
import { REPO_ROOT, featureAreasRoot } from './paths.mjs';
import {
  loadCoverageConfig,
  loadRequiredScenariosConfig,
  loadCoverageModelConfig,
  parseArgs,
  resolveE2eConfigPath,
} from './config.mjs';
import { readSource, walkTsFiles } from './file-io.mjs';
import { computeRequiredScenarioMatrix } from './required-scenarios.mjs';
import { isLedgerSpecFile, resolveE2eExtraModules } from './ledger-helpers.mjs';
import {
  collectAllRepoTestRailIds,
  fetchTestRailRunExecution,
  fetchTestRailSuiteAutomationIds,
  getTestRailAuth,
  loadTestRailRunReference,
  normalizeTestRailRunReference,
} from './testrail.mjs';
import {
  createAst,
  countParametrizedRows,
  extractAppTestIds,
  extractE2eTestIdRefs,
  extractFeatureName,
  fileContainsJsx,
  collectPlaywrightTestAndDescribeTitles,
  ts,
} from './typescript-ast.mjs';
import {
  dedupeFusionSwapFolders,
  inferMatchedFeatureDirs,
  mergeAttributedTestIds,
  refinePagesFolderMatchesForExtension,
} from './feature-matching.mjs';
import { transitiveE2eModuleSet } from './e2e-module-graph.mjs';
import {
  appDefinesTestId,
  appPatternTouchedByE2e,
  computeComponentFeatureFolderCoverage,
  e2eTouchesAppStaticId,
  filterIgnoredOrphans,
  partitionAppCoverage,
} from './coverage-aggregation.mjs';
export async function main() {
  const opts = parseArgs(process.argv);
  const e2eRootNorm = path.normalize(opts.e2eDir);
  const coverageConfig = loadCoverageConfig(opts.e2eDir);
  const requiredScenariosCfg = loadRequiredScenariosConfig(opts.e2eDir);
  const coverageModelCfg = loadCoverageModelConfig(opts.e2eDir);
  const requiredScenarioMatrix = computeRequiredScenarioMatrix(
    opts.e2eDir,
    requiredScenariosCfg,
  );
  const appFiles = [];
  for (const root of opts.appRoots) {
    walkTsFiles(root, appFiles, { app: true });
  }
  const specFiles = [];
  walkTsFiles(path.join(opts.e2eDir, 'tests'), specFiles, { app: false });
  const specs = specFiles.filter(
    (f) => f.endsWith('.spec.ts') || f.endsWith('.spec.tsx'),
  );
  const repoTestRailIds = collectAllRepoTestRailIds(
    path.join(opts.e2eDir, 'tests'),
  );

  const ledgerExtraAbs = resolveE2eExtraModules(
    e2eRootNorm,
    coverageConfig.ledgerSpecAdditionalModules,
  );

  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const appIds = { statics: new Set(), globs: new Set() };
  const program = ts.createProgram(appFiles, {
    target: ts.ScriptTarget.Latest,
    allowJs: true,
    jsx: ts.JsxEmit.React,
  });
  const appChecker = program.getTypeChecker();

  const pagesFeatureRoot = featureAreasRoot();
  /** @type {Map<string, { statics: Set<string>, globs: Set<string> }>} */
  const featureToTestIds = new Map();
  let componentTsxWithJsx = 0;
  let componentTsxWithJsxNoTestId = 0;

  for (const f of appFiles) {
    const sf = program.getSourceFile(f);
    if (!sf) {
      continue;
    }
    const part = extractAppTestIds(sf, appChecker);
    for (const s of part.statics) {
      appIds.statics.add(s);
    }
    for (const g of part.globs) {
      appIds.globs.add(g);
    }

    const normF = path.normalize(f);
    if (normF.startsWith(pagesFeatureRoot) && f.endsWith('.tsx')) {
      const rel = path.relative(pagesFeatureRoot, f);
      const top = rel.split(path.sep)[0];
      if (top && !top.startsWith('.')) {
        if (!featureToTestIds.has(top)) {
          featureToTestIds.set(top, { statics: new Set(), globs: new Set() });
        }
        const bucket = featureToTestIds.get(top);
        for (const s of part.statics) {
          bucket.statics.add(s);
        }
        for (const g of part.globs) {
          bucket.globs.add(g);
        }
      }
      if (fileContainsJsx(sf)) {
        componentTsxWithJsx++;
        if (part.statics.size === 0 && part.globs.size === 0) {
          componentTsxWithJsxNoTestId++;
        }
      }
    }
  }

  /** @type {typeof appIds} */
  const globalE2e = { statics: new Set(), globs: new Set() };
  const perFeature = [];
  /** Union of apps/next/src/pages/* folder names matched by any spec (stem/describe/titles). */
  const featureAreasClaimedByE2e = new Set();

  /** @type {Map<string, Set<string>>} */
  const modulesBySpec = new Map();
  /** @type {Set<string>} */
  const allE2eModules = new Set();
  for (const spec of specs) {
    const extraLedger = isLedgerSpecFile(spec) ? ledgerExtraAbs : [];
    const modules = transitiveE2eModuleSet(spec, e2eRootNorm, extraLedger);
    modulesBySpec.set(spec, modules);
    for (const m of modules) {
      allE2eModules.add(m);
    }
  }

  const sharedE2eProgram =
    allE2eModules.size > 0
      ? ts.createProgram([...allE2eModules], {
          target: ts.ScriptTarget.Latest,
          allowJs: true,
        })
      : null;
  const sharedE2eChecker = sharedE2eProgram
    ? sharedE2eProgram.getTypeChecker()
    : null;
  /** @type {Map<string, ReturnType<typeof extractE2eTestIdRefs>>} */
  const e2eModuleRefsCache = new Map();
  if (sharedE2eProgram && sharedE2eChecker) {
    for (const m of allE2eModules) {
      const sf = sharedE2eProgram.getSourceFile(m);
      if (!sf) {
        continue;
      }
      e2eModuleRefsCache.set(m, extractE2eTestIdRefs(sf, sharedE2eChecker));
    }
  }

  for (const spec of specs) {
    const modules = modulesBySpec.get(spec) ?? new Set();
    /** @type {typeof appIds} */
    const e2eUnion = { statics: new Set(), globs: new Set() };
    for (const m of modules) {
      const part = e2eModuleRefsCache.get(m);
      if (!part) {
        continue;
      }
      for (const s of part.statics) {
        e2eUnion.statics.add(s);
        globalE2e.statics.add(s);
      }
      for (const g of part.globs) {
        e2eUnion.globs.add(g);
        globalE2e.globs.add(g);
      }
    }

    const specText = readSource(spec);
    const specSf = createAst(spec, specText, spec.endsWith('tsx'));
    const baseName = path.basename(spec, path.extname(spec));
    const stem = baseName.replace(/\.spec$/i, '') || baseName;
    const describeTitle = extractFeatureName(specSf);
    const feature =
      describeTitle ??
      path.basename(spec, path.extname(spec)).replace(/\.spec$/, '');
    /** Primary: file stem + outermost describe title — enough to credit the intended feature without noisy cross-matches. */
    const primaryCorpus = [
      stem,
      ...(describeTitle ? [describeTitle] : []),
    ].filter(Boolean);
    const matchedPrimary = inferMatchedFeatureDirs(
      featureToTestIds,
      primaryCorpus,
      { minTokenLen: 4 },
    );
    /** Secondary: long tokens (≥8) from individual test titles only (reduces cross-folder "swap" noise). */
    const looseTitles = collectPlaywrightTestAndDescribeTitles(specSf).filter(
      (t) => t !== describeTitle,
    );
    const matchedLoose = inferMatchedFeatureDirs(
      featureToTestIds,
      looseTitles,
      { minTokenLen: 8 },
    );
    const matchedFeatureDirs = new Set([...matchedPrimary, ...matchedLoose]);
    dedupeFusionSwapFolders(matchedFeatureDirs, [
      stem,
      ...(describeTitle ? [describeTitle] : []),
      ...looseTitles,
    ]);
    refinePagesFolderMatchesForExtension(
      spec,
      specText,
      matchedFeatureDirs,
      featureToTestIds,
    );
    for (const d of matchedFeatureDirs) {
      featureAreasClaimedByE2e.add(d);
    }
    const attributed = mergeAttributedTestIds(
      featureToTestIds,
      matchedFeatureDirs,
    );
    let testIdsAddedByTitleAttribution = 0;
    for (const s of attributed.statics) {
      if (!e2eUnion.statics.has(s)) {
        testIdsAddedByTitleAttribution++;
      }
      e2eUnion.statics.add(s);
      globalE2e.statics.add(s);
    }
    for (const g of attributed.globs) {
      if (!e2eUnion.globs.has(g)) {
        testIdsAddedByTitleAttribution++;
      }
      e2eUnion.globs.add(g);
      globalE2e.globs.add(g);
    }

    const paramRows = countParametrizedRows(specSf);

    const { coveredStatics, coveredGlobs, numerator, denominator } =
      partitionAppCoverage(appIds, e2eUnion);
    const pct = denominator === 0 ? 0 : (numerator / denominator) * 100;

    const orphanE2e = filterIgnoredOrphans(
      [...e2eUnion.statics].filter((id) => !appDefinesTestId(id, appIds)),
      coverageConfig.ignoredOrphanTestIds,
    );

    perFeature.push({
      spec: path.relative(REPO_ROOT, spec),
      feature,
      parametrizedRows: paramRows,
      attributedFeatureDirs: [...matchedFeatureDirs].sort(),
      testIdsAddedByTitleAttribution,
      coveredStaticCount: coveredStatics.length,
      uncoveredStaticCount: appIds.statics.size - coveredStatics.length,
      coveredPatternCount: coveredGlobs.length,
      uncoveredPatternCount: appIds.globs.size - coveredGlobs.length,
      percent: Math.round(pct * 100) / 100,
      numerator,
      denominator,
      orphanE2eTestIds: orphanE2e,
    });
  }

  const globalPart = partitionAppCoverage(appIds, globalE2e);
  const gDenom = globalPart.denominator;
  const gNum = globalPart.numerator;
  const gPct = gDenom === 0 ? 0 : (gNum / gDenom) * 100;
  const surfaceGap = componentTsxWithJsxNoTestId;
  const featureFolderCov = computeComponentFeatureFolderCoverage(
    featureToTestIds,
    globalE2e,
  );

  const totalAppFeatureAreas = featureToTestIds.size;
  const featureAreasMatchedBySpecs = featureAreasClaimedByE2e.size;
  const e2eFeaturePercent =
    totalAppFeatureAreas === 0
      ? 0
      : (featureAreasMatchedBySpecs / totalAppFeatureAreas) * 100;
  const uncoveredFeatureAreas = [...featureToTestIds.keys()]
    .filter((k) => !featureAreasClaimedByE2e.has(k))
    .sort();

  const rawOrphans = [...globalE2e.statics]
    .filter((id) => !appDefinesTestId(id, appIds))
    .sort();
  const orphanE2eFiltered = filterIgnoredOrphans(
    rawOrphans,
    coverageConfig.ignoredOrphanTestIds,
  );

  /** @type {Record<string, unknown>} */
  let testRailReport = {
    repoAutomationIds: repoTestRailIds,
    note: 'IDs parsed from custom_automation_id:… in spec annotations. Compare to TestRail suite for manual-test gap.',
  };
  if (opts.testrail) {
    const trAuth = getTestRailAuth();
    const runIdEnv = process.env.TESTRAIL_RUN_ID;
    if (trAuth && runIdEnv) {
      const rx = await fetchTestRailRunExecution(
        trAuth.host,
        trAuth.authHeader,
        runIdEnv,
      );
      if (rx.ok) {
        const { ok: _ok, ...rest } = rx;
        testRailReport.testRailRunExecution = { ...rest, source: 'api' };
      } else {
        testRailReport.testRailRunExecutionFetchError = rx.error;
      }
    }
    if (!testRailReport.testRailRunExecution) {
      const refNorm = normalizeTestRailRunReference(
        loadTestRailRunReference(opts.e2eDir),
      );
      if (refNorm) {
        testRailReport.testRailRunExecution = {
          ...refNorm,
          source: 'e2e/testrail-run-reference.json',
        };
      }
    }
    if (!runIdEnv && !testRailReport.testRailRunExecution) {
      testRailReport.testRailRunExecutionHint =
        'Set TESTRAIL_RUN_ID (with TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY) or add e2e/testrail-run-reference.json to report pass+fail vs total for a run (see testRailRunExecution).';
    }

    const projectId = process.env.TESTRAIL_PROJECT_ID;
    const suiteId = process.env.TESTRAIL_SUITE_ID;
    if (trAuth && projectId && suiteId) {
      const tr = await fetchTestRailSuiteAutomationIds();
      if (tr.ok) {
        const suiteSet = new Set(tr.suiteAutomationIds);
        const repoSet = new Set(repoTestRailIds);
        const inSuiteNotInRepo = tr.suiteAutomationIds.filter(
          (id) => !repoSet.has(id),
        );
        const inRepoNotInSuite = repoTestRailIds.filter(
          (id) => !suiteSet.has(id),
        );
        testRailReport = {
          ...testRailReport,
          fetchOk: true,
          suiteAutomationIds: tr.suiteAutomationIds,
          inSuiteNotAutomatedInRepo: inSuiteNotInRepo,
          inRepoNotInSuite,
          suiteTotalWithAutomationField: tr.suiteAutomationIds.length,
        };
      } else {
        testRailReport = {
          ...testRailReport,
          fetchOk: false,
          fetchError: tr.error,
        };
      }
    } else {
      testRailReport.suiteFetchSkipped =
        'Set TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID (with host/user/key) to compare suite automation IDs to the repo.';
    }
  } else {
    testRailReport = {
      ...testRailReport,
      fetchSkipped:
        'Pass --testrail and set TESTRAIL_* env vars for TestRail comparison (run execution and/or suite).',
    };
  }

  const walletModesAssumed = Math.max(
    1,
    requiredScenariosCfg.walletModes.length,
  );
  const featureWalletSlotsTotal = totalAppFeatureAreas * walletModesAssumed;
  const featureWalletSlotsFilledAssumption = featureAreasMatchedBySpecs;
  const featureWalletSlotPercent =
    featureWalletSlotsTotal === 0
      ? 0
      : Math.round(
          (featureWalletSlotsFilledAssumption / featureWalletSlotsTotal) *
            10000,
        ) / 100;

  const featureCoveragePercent = Math.round(e2eFeaturePercent * 100) / 100;
  const requiredScenariosPercent = requiredScenarioMatrix.percent;
  const wModel = coverageModelCfg.weights;
  const codebaseCompositePercent =
    Math.round(
      (wModel.e2eFeatureCoveragePercent * featureCoveragePercent +
        wModel.requiredScenariosPercent * requiredScenariosPercent +
        wModel.featureFolderWalletSlotPercent * featureWalletSlotPercent) *
        100,
    ) / 100;

  const report = {
    metricsExplainer: {
      allAppFeatureAreas: {
        jsonPath: 'e2eFeatureCoverage',
        ignoresWalletType: true,
        description:
          'Primary breadth metric: share of top-level apps/next/src/pages/* folders that match at least one Playwright spec (file stem, describe, test titles). Wallet type is not considered. Includes non-transaction surfaces (e.g. onboarding, settings) when specs attribute to those folders.',
      },
      walletModeMatrix: {
        jsonPath: 'requiredScenarios',
        description:
          'Supplemental metric only: flow × wallet-mode cells from e2e/required-scenarios.config.json. Does not measure coverage of wallet-agnostic features; it is not a substitute for e2eFeatureCoverage.percent.',
      },
      codebaseComposite: {
        jsonPath: 'codebaseCompositeCoverage',
        description:
          'Headline % from codebase only: weighted sum of e2eFeatureCoverage.percent, requiredScenarios.percent, and featureFolderWalletSlotAssumption.percent (see e2e/coverage-model.config.json). Not derived from TestRail. Treat impliedUncertaintyPercentagePoints as approximate band (e.g. ±10).',
      },
      testRailRunView: {
        jsonPath: 'testrail.testRailRunExecution',
        description:
          'Optional manual cross-check only (--testrail / reference file). Not used in codebaseCompositeCoverage.',
      },
      aggressiveWalletSlots: {
        jsonPath: 'featureFolderWalletSlotAssumption',
        description:
          'Harsh lower bound: every pages/* folder ×N wallet slots (N = walletModes in required-scenarios.config.json); one slot per matched folder. Often low double digits %.',
      },
    },
    e2eFeatureCoverage: {
      definition:
        'Share of top-level apps/next/src/pages/* folders associated with at least one Playwright spec via file stem, test.describe title, or test() titles (word/token match). Not based on data-testid. Wallet type is not part of this percentage.',
      totalAppFeatureAreas,
      featureAreasMatchedByAtLeastOneSpec: featureAreasMatchedBySpecs,
      percent: featureCoveragePercent,
      uncoveredFeatureAreas,
      playwrightSpecFiles: specs.length,
    },
    featureFolderWalletSlotAssumption: {
      definition: `Aggressive model: assumes each top-level apps/next/src/pages/* folder should be covered under ${walletModesAssumed} wallet modes; credits one slot per folder that has any spec match (typically mnemonic-heavy). Denominator = folders×${walletModesAssumed}.`,
      walletModesAssumed,
      totalSlots: featureWalletSlotsTotal,
      filledSlotsCredited: featureWalletSlotsFilledAssumption,
      percent: featureWalletSlotPercent,
    },
    appRoots: opts.appRoots.map((p) => path.relative(REPO_ROOT, p)),
    e2eDir: path.relative(REPO_ROOT, opts.e2eDir),
    config: {
      path: path.relative(
        REPO_ROOT,
        resolveE2eConfigPath(opts.e2eDir, 'testid-coverage.config.json'),
      ),
      ignoredOrphanTestIds: coverageConfig.ignoredOrphanTestIds,
      ledgerSpecAdditionalModules: coverageConfig.ledgerSpecAdditionalModules,
    },
    requiredScenarios: {
      definition:
        requiredScenariosCfg.definition ??
        'Supplemental: each configured product flow should have e2e under mnemonic (extension.fixture), seedless (seedless path/fixture/tags), and ledger (tests/ledger) where applicable. Orthogonal to e2eFeatureCoverage (all top-level pages/* folders).',
      configPath: path.relative(
        REPO_ROOT,
        resolveE2eConfigPath(opts.e2eDir, 'required-scenarios.config.json'),
      ),
      flows: requiredScenariosCfg.flows,
      walletModes: requiredScenariosCfg.walletModes,
      totalRequired: requiredScenarioMatrix.totalRequired,
      implementedCount: requiredScenarioMatrix.implementedCount,
      percent: requiredScenarioMatrix.percent,
      missing: requiredScenarioMatrix.missing,
      scenarios: requiredScenarioMatrix.scenarios,
    },
    codebaseCompositeCoverage: {
      definition:
        coverageModelCfg.definition ??
        'Codebase-only headline: weighted blend of feature-folder breadth, flow×wallet matrix completeness, and aggressive wallet×folder slots. Interpret as ± impliedUncertaintyPercentagePoints percentage points (model uncertainty, not external QA data).',
      configPath: path.relative(
        REPO_ROOT,
        resolveE2eConfigPath(opts.e2eDir, 'coverage-model.config.json'),
      ),
      formula: 'weightedSum',
      weights: coverageModelCfg.weights,
      impliedUncertaintyPercentagePoints:
        coverageModelCfg.impliedUncertaintyPercentagePoints,
      percent: codebaseCompositePercent,
      components: {
        e2eFeatureCoveragePercent: featureCoveragePercent,
        requiredScenariosPercent,
        featureFolderWalletSlotPercent: featureWalletSlotPercent,
      },
    },
    specs: perFeature.sort((a, b) => a.feature.localeCompare(b.feature)),
    testrail: testRailReport,
  };

  if (opts.testidInventory) {
    report.testidInventory = {
      totals: {
        appStaticTestIds: appIds.statics.size,
        appPatternTestIds: appIds.globs.size,
        denominator: gDenom,
        coveredStatic: globalPart.coveredStatics.length,
        coveredPattern: globalPart.coveredGlobs.length,
        numerator: gNum,
        percent: Math.round(gPct * 100) / 100,
        componentFeatureDirs: featureToTestIds.size,
        componentTsxFilesWithJsx: componentTsxWithJsx,
        componentTsxFilesWithJsxNoTestId: surfaceGap,
        surfaceNote:
          'TSX files under apps/next/src/pages with JSX but no data-testid/dataTestId in that file are not selectable by testid (coarse per-file signal; layouts may delegate testids to children).',
        featureAreasByTestid: {
          definition:
            'Top-level folder under apps/next/src/pages. "Touched" = global e2e references ≥1 testid (or pattern) declared under that folder.',
          totalTopLevelFolders: featureFolderCov.totalTopLevelFolders,
          foldersWithDeclaredTestIds:
            featureFolderCov.foldersWithDeclaredTestIds,
          foldersWithNoTestIdsDeclared:
            featureFolderCov.foldersWithNoTestIdsDeclared,
          foldersTouchedByGlobalE2e: featureFolderCov.foldersTouchedByE2e,
          percentAmongFoldersWithTestIds:
            featureFolderCov.percentAmongFoldersWithTestIds,
          percentOfAllComponentAreasWithDeclaredTestIds:
            featureFolderCov.percentOfAllComponentAreasWithDeclaredTestIds,
          percentOfAllComponentAreasTouchedByE2e:
            featureFolderCov.percentOfAllComponentAreasTouchedByE2e,
          uncoveredFoldersWithTestIds:
            featureFolderCov.uncoveredFoldersWithTestIds,
        },
        orphanE2eReferences: orphanE2eFiltered,
        ignoredOrphansExcludedFromReport: rawOrphans.filter((id) =>
          coverageConfig.ignoredOrphanTestIds.includes(id),
        ),
      },
      uncovered: {
        statics: globalPart.uncoveredStatics.sort(),
        patterns: globalPart.uncoveredGlobs.sort(),
      },
    };
  }

  if (opts.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  const lines = [];
  const fc = report.e2eFeatureCoverage;
  lines.push('E2E feature coverage (core-extension)');
  lines.push(
    `App roots: ${report.appRoots.join(', ')} | E2E: ${report.e2eDir}`,
  );
  lines.push(
    `Feature areas matched by Playwright specs: ${fc.featureAreasMatchedByAtLeastOneSpec}/${fc.totalAppFeatureAreas} (${fc.percent}%) — ${fc.playwrightSpecFiles} spec files`,
  );
  lines.push(
    'Heuristic: spec file stem + describe + test titles → top-level apps/next/src/pages/* folder names (see JSON definition).',
  );
  lines.push(
    '(Above % is wallet-agnostic — any feature folder touched by a spec counts, including non-transaction UI.)',
  );
  const rs = report.requiredScenarios;
  if (rs) {
    lines.push(
      `Required scenarios (flows × wallet, supplemental): ${rs.implementedCount}/${rs.totalRequired} (${rs.percent}%) — ${rs.configPath}`,
    );
    if (rs.missing?.length) {
      lines.push(`  missing: ${rs.missing.join(', ')}`);
    }
  }
  const cbc = report.codebaseCompositeCoverage;
  if (cbc) {
    lines.push(
      `Codebase composite coverage (headline): ${cbc.percent}% (±${cbc.impliedUncertaintyPercentagePoints} pp model uncertainty) — ${cbc.configPath}`,
    );
  }
  const fws = report.featureFolderWalletSlotAssumption;
  if (fws) {
    lines.push(
      `Aggressive wallet×folder slots (${fws.walletModesAssumed}× folders, mnemonic credit): ${fws.filledSlotsCredited}/${fws.totalSlots} (${fws.percent}%)`,
    );
  }
  if (!opts.testidInventory) {
    lines.push(
      'Add --testid-inventory for data-testid selector inventory (optional).',
    );
  }
  lines.push('');
  for (const row of report.specs) {
    const dirs = row.attributedFeatureDirs?.length
      ? row.attributedFeatureDirs.join(', ')
      : '(none)';
    lines.push(
      `${row.feature}  (${row.spec})  →  [${dirs}]  [param rows ≥ ${row.parametrizedRows}]`,
    );
    if (opts.testidInventory) {
      lines.push(
        `    testid buckets: ${row.numerator}/${row.denominator} = ${row.percent}%`,
      );
    }
    if (opts.verbose && row.orphanE2eTestIds?.length) {
      lines.push(
        `  orphan e2e refs (not in app): ${row.orphanE2eTestIds.join(', ')}`,
      );
    }
  }
  lines.push('');
  lines.push(`Uncovered feature folders (${fc.uncoveredFeatureAreas.length}):`);
  if (opts.verbose && fc.uncoveredFeatureAreas.length) {
    lines.push(fc.uncoveredFeatureAreas.join('\n'));
  }

  if (opts.testidInventory && report.testidInventory) {
    const ti = report.testidInventory;
    lines.push('');
    lines.push('--- testid inventory (optional) ---');
    lines.push(
      `Testid buckets: ${ti.totals.numerator}/${ti.totals.denominator} (${ti.totals.percent}%) — static: ${ti.totals.appStaticTestIds}, patterns: ${ti.totals.appPatternTestIds}`,
    );
    lines.push(
      `Surface gap (coarse): ${ti.totals.componentTsxFilesWithJsxNoTestId} TSX files under apps/next/src/pages have JSX but no testid in file (${ti.totals.componentTsxFilesWithJsx} jsx files total).`,
    );
    lines.push(
      `Feature areas (testid touch): ${ti.totals.featureAreasByTestid.totalTopLevelFolders} folders; ${ti.totals.featureAreasByTestid.foldersWithDeclaredTestIds} declare testids; e2e touches ${ti.totals.featureAreasByTestid.foldersTouchedByGlobalE2e} → ${ti.totals.featureAreasByTestid.percentOfAllComponentAreasTouchedByE2e}% of all areas by testid`,
    );
    lines.push(`Uncovered static ids (global): ${ti.uncovered.statics.length}`);
    if (opts.verbose && ti.uncovered.statics.length) {
      lines.push(ti.uncovered.statics.join('\n'));
    }
    lines.push(
      `Uncovered pattern buckets (global): ${ti.uncovered.patterns.length}`,
    );
    if (opts.verbose && ti.uncovered.patterns.length) {
      lines.push(ti.uncovered.patterns.join('\n'));
    }
    lines.push(
      `Orphan e2e refs (global, after config ignore): ${ti.totals.orphanE2eReferences.length}`,
    );
    if (opts.verbose && ti.totals.orphanE2eReferences.length) {
      lines.push(ti.totals.orphanE2eReferences.join('\n'));
    }
    if (ti.totals.ignoredOrphansExcludedFromReport.length) {
      lines.push(
        `Ignored orphans: ${ti.totals.ignoredOrphansExcludedFromReport.join(', ')}`,
      );
    }
  }

  lines.push('');
  const tr = report.testrail;
  if (tr.testRailRunExecution) {
    const tre = tr.testRailRunExecution;
    lines.push(
      `TestRail run ${tre.runId}: pass+fail ${tre.executedPassFailCount}/${tre.testsCount} (${tre.percentPassFailOfRunTests}%) — matches run view; source: ${tre.source}`,
    );
  }
  if (opts.testrail && tr.testRailRunExecutionFetchError) {
    lines.push(`TestRail get_run failed: ${tr.testRailRunExecutionFetchError}`);
  }
  if (opts.testrail && tr.testRailRunExecutionHint) {
    lines.push(String(tr.testRailRunExecutionHint));
  }
  lines.push(
    `TestRail automation IDs in repo (annotations): ${tr.repoAutomationIds?.length ?? 0}`,
  );
  if (tr.fetchOk) {
    lines.push(
      `TestRail suite IDs with automation field: ${tr.suiteTotalWithAutomationField} | in suite not in repo: ${tr.inSuiteNotAutomatedInRepo?.length ?? 0}`,
    );
  } else if (opts.testrail && tr.fetchError) {
    lines.push(`TestRail suite fetch failed: ${tr.fetchError}`);
  } else if (tr.fetchSkipped) {
    lines.push(String(tr.fetchSkipped));
  }
  if (opts.testrail && tr.suiteFetchSkipped) {
    lines.push(String(tr.suiteFetchSkipped));
  }

  process.stdout.write(`${lines.join('\n')}\n`);
}
