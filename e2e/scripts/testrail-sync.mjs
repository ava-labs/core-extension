#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * TestRail ↔ E2E automation sync.
 *
 * Reconciles the `custom_automation_id` annotations on Playwright tests with
 * TestRail's case-level automation ID custom field. Designed as an improvement
 * over the Core Web equivalent in two key areas:
 *
 *   1. **Robust test discovery.** Instead of regex-scraping `*.spec.ts`, this
 *      script invokes `playwright test --list --reporter=json` so that
 *      template-literal IDs (e.g. `custom_automation_id:SWP-MOCK-FLOW-${key}`
 *      in `tests/swap-mock.spec.ts`, or `${row.testrailId}` in
 *      `tests/send.spec.ts`) are resolved by the runtime, not the parser.
 *
 *   2. **CI-safe by default.** No interactive prompt. `--apply` is required to
 *      mutate TestRail. A non-TTY shell stays in report-only mode unless
 *      `--apply` is explicitly passed. Optional `--failOn*` flags let the
 *      caller choose which kinds of drift block the job.
 *
 * Required env:
 *   TESTRAIL_HOST       e.g. https://avalabs.testrail.io
 *   TESTRAIL_EMAIL      TestRail login email
 *   TESTRAIL_API_KEY    TestRail API key (NOT account password)
 *   TESTRAIL_PROJECT_ID Project ID (or pass --projectId)
 *
 * Usage:
 *   node scripts/testrail-sync.mjs [flags]
 *
 *   --projectId <id>            TestRail project ID (or TESTRAIL_PROJECT_ID env)
 *   --suiteId <id>              Optional suite filter (or TESTRAIL_SUITE_ID env)
 *   --testrailField <key>       Custom field key (default: custom_case_automation_id)
 *   --grep <pattern>            Restrict Playwright discovery (e.g. "@regression")
 *   --apply                     Push title-matched updates to TestRail
 *   --failOnMissing             Exit 1 if any local IDs are absent in TestRail
 *   --failOnDuplicates          Exit 1 if local tests share an automation_id
 *   --failOnUnannotated         Exit 1 if any tests lack an automation_id
 *   --json                      Emit machine-readable summary at the end
 *   --debugCases [n]            Dump n raw TestRail case objects (default 5)
 *   --help, -h                  Show this help
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const E2E_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(E2E_DIR, '..');

function parseArgs(argv) {
  const args = {
    projectId: process.env.TESTRAIL_PROJECT_ID,
    suiteId: process.env.TESTRAIL_SUITE_ID,
    testrailField: 'custom_case_automation_id',
    grep: undefined,
    apply: false,
    failOnMissing: false,
    failOnDuplicates: false,
    failOnUnannotated: false,
    json: false,
    jsonOut: undefined,
    debugCases: false,
    debugCasesLimit: 5,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    const consumeNext = () => {
      i += 1;
      return next;
    };

    switch (arg) {
      case '--projectId':
      case '-p':
        args.projectId = consumeNext();
        break;
      case '--suiteId':
      case '-s':
        args.suiteId = consumeNext();
        break;
      case '--testrailField':
      case '-f':
        args.testrailField = consumeNext();
        break;
      case '--grep':
      case '-g':
        args.grep = consumeNext();
        break;
      case '--apply':
        args.apply = true;
        break;
      case '--failOnMissing':
        args.failOnMissing = true;
        break;
      case '--failOnDuplicates':
        args.failOnDuplicates = true;
        break;
      case '--failOnUnannotated':
        args.failOnUnannotated = true;
        break;
      case '--json':
        args.json = true;
        break;
      case '--jsonOut':
        args.jsonOut = consumeNext();
        break;
      case '--debugCases':
        args.debugCases = true;
        if (next && /^\d+$/.test(next)) {
          args.debugCasesLimit = Number(consumeNext());
        }
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown flag: ${arg}`);
          printHelp();
          process.exit(2);
        }
    }
  }

  return args;
}

function printHelp() {
  const banner = `Reconcile Playwright e2e custom_automation_id annotations with TestRail.

Usage:
  node scripts/testrail-sync.mjs [--projectId <id>] [--apply] [--failOnMissing] [...]

Required env:
  TESTRAIL_HOST       e.g. https://avalabs.testrail.io
  TESTRAIL_EMAIL      TestRail login email
  TESTRAIL_API_KEY    TestRail API key
  TESTRAIL_PROJECT_ID Project ID (or pass --projectId)

Flags:
  --projectId, -p          TestRail project ID
  --suiteId, -s            Optional suite filter
  --testrailField, -f      Custom field key (default: custom_case_automation_id)
  --grep, -g               Restrict Playwright discovery (e.g. "@regression")
  --apply                  Push title-matched updates to TestRail (default: report-only)
  --failOnMissing          Exit 1 if any local IDs are absent in TestRail
  --failOnDuplicates       Exit 1 if local tests share an automation_id
  --failOnUnannotated      Exit 1 if any tests lack an automation_id
  --json                   Print a machine-readable summary at the end
  --jsonOut <path>         Write the same machine-readable summary to a file
  --debugCases [n]         Dump n raw TestRail case objects (default 5)
  --help, -h               Show this help
`;
  console.log(banner);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeId(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase();
}

function normalizeTitle(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function uniq(values) {
  return [...new Set(values)];
}

function printSection(title) {
  const bar = '-'.repeat(title.length);
  console.log(`\n${title}\n${bar}`);
}

// ---------------------------------------------------------------------------
// Test discovery via Playwright --list (resolves dynamic IDs and titles)
// ---------------------------------------------------------------------------

async function discoverTests({ grep }) {
  const args = ['playwright', 'test', '--list', '--reporter=json'];
  if (grep) {
    args.push('--grep', grep);
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('npx', args, {
      cwd: E2E_DIR,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    proc.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            `playwright --list exited with code ${code}\nstderr:\n${stderr}`,
          ),
        );
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (err) {
        reject(
          new Error(
            `Failed to parse Playwright JSON output: ${err.message}\nFirst 500 chars:\n${stdout.slice(0, 500)}`,
          ),
        );
      }
    });
  });
}

function flattenSpecs(reportJson) {
  const out = [];

  function walk(suites) {
    for (const suite of suites ?? []) {
      walk(suite.suites);
      for (const spec of suite.specs ?? []) {
        const tests = spec.tests ?? [];
        const annotations =
          tests.find((t) => Array.isArray(t.annotations))?.annotations ?? [];
        out.push({
          title: String(spec.title ?? '').trim(),
          file: String(spec.file ?? ''),
          line: spec.line,
          tags: spec.tags ?? [],
          annotations,
        });
      }
    }
  }

  walk(reportJson.suites);
  return out;
}

function extractAutomationId(annotations) {
  for (const a of annotations ?? []) {
    if (a.type !== 'testrail_case_field' || typeof a.description !== 'string') {
      continue;
    }
    const match = a.description.match(/^custom_automation_id:(.+)$/);
    if (match) {
      return normalizeId(match[1]);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// TestRail API
// ---------------------------------------------------------------------------

function authHeader(email, apiKey) {
  return `Basic ${Buffer.from(`${email}:${apiKey}`).toString('base64')}`;
}

async function fetchAllCases({ host, email, apiKey, projectId, suiteId }) {
  const collected = [];
  const limit = 250;
  let offset = 0;

  while (true) {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    if (suiteId) {
      params.set('suite_id', String(suiteId));
    }

    const url = `${host.replace(/\/$/, '')}/index.php?/api/v2/get_cases/${projectId}&${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authHeader(email, apiKey),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`TestRail get_cases ${response.status}: ${body}`);
    }

    const payload = await response.json();

    if (Array.isArray(payload)) {
      collected.push(...payload);
      break;
    }

    const page = payload.cases ?? [];
    collected.push(...page);

    const hasMore = Boolean(payload?._links?.next);
    if (!hasMore || page.length === 0) {
      break;
    }
    offset += limit;
  }

  return collected;
}

async function updateTestRailCase({
  host,
  email,
  apiKey,
  caseId,
  fieldName,
  value,
}) {
  const url = `${host.replace(/\/$/, '')}/index.php?/api/v2/update_case/${caseId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader(email, apiKey),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ [fieldName]: value }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `update_case failed for ${caseId} (${response.status}): ${body}`,
    );
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function relativeFromRepoRoot(filePath) {
  if (!filePath) {
    return '';
  }
  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(E2E_DIR, 'tests', filePath);
  return path.relative(REPO_ROOT, abs);
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.projectId) {
    console.error('Missing --projectId (or TESTRAIL_PROJECT_ID env).');
    printHelp();
    process.exit(2);
  }

  const host = requireEnv('TESTRAIL_HOST');
  const email = requireEnv('TESTRAIL_EMAIL');
  const apiKey = requireEnv('TESTRAIL_API_KEY');

  console.log(`TestRail host:      ${host}`);
  console.log(`Project ID:         ${args.projectId}`);
  console.log(`Suite ID:           ${args.suiteId ?? '(all)'}`);
  console.log(`TestRail field:     ${args.testrailField}`);
  console.log(`Discovery grep:     ${args.grep ?? '(none)'}`);
  console.log(`Mode:               ${args.apply ? 'APPLY' : 'report-only'}`);

  const [pwReport, testRailCases] = await Promise.all([
    discoverTests({ grep: args.grep }),
    fetchAllCases({
      host,
      email,
      apiKey,
      projectId: args.projectId,
      suiteId: args.suiteId,
    }),
  ]);

  if (args.debugCases) {
    const safeLimit =
      Number.isFinite(args.debugCasesLimit) && args.debugCasesLimit > 0
        ? Math.floor(args.debugCasesLimit)
        : 5;
    const sample = testRailCases.slice(0, safeLimit);
    printSection(
      `Debug TestRail cases (showing ${sample.length} of ${testRailCases.length})`,
    );
    sample.forEach((c, idx) => {
      console.log(`\nCase ${idx + 1}:`);
      console.log(`- id:    ${c.id}`);
      console.log(`- title: ${c.title ?? '(none)'}`);
      console.log(
        `- ${args.testrailField}: ${String(c?.[args.testrailField] ?? '')}`,
      );
      console.log(`- keys:  ${Object.keys(c).sort().join(', ')}`);
    });
  }

  // ---- Local catalog ------------------------------------------------------
  const specs = flattenSpecs(pwReport);

  const idToSpecs = new Map();
  const titleToSpecs = new Map();
  const unannotated = [];

  for (const spec of specs) {
    const id = extractAutomationId(spec.annotations);
    const titleKey = normalizeTitle(spec.title);

    if (titleKey) {
      const list = titleToSpecs.get(titleKey) ?? [];
      list.push(spec);
      titleToSpecs.set(titleKey, list);
    }

    if (id) {
      const list = idToSpecs.get(id) ?? [];
      list.push(spec);
      idToSpecs.set(id, list);
    } else {
      unannotated.push(spec);
    }
  }

  const localIds = [...idToSpecs.keys()].sort();
  const duplicateIds = [...idToSpecs.entries()].filter(
    ([, list]) => list.length > 1,
  );

  // ---- TestRail catalog ---------------------------------------------------
  const trIdToCases = new Map();
  const trTitleToCases = new Map();
  for (const c of testRailCases) {
    const id = normalizeId(c?.[args.testrailField]);
    if (id) {
      const list = trIdToCases.get(id) ?? [];
      list.push(c);
      trIdToCases.set(id, list);
    }
    const titleKey = normalizeTitle(c.title);
    if (titleKey) {
      const list = trTitleToCases.get(titleKey) ?? [];
      list.push(c);
      trTitleToCases.set(titleKey, list);
    }
  }

  const trIds = [...trIdToCases.keys()];
  const missingInTestRail = localIds.filter((id) => !trIdToCases.has(id));
  const missingInLocal = trIds.filter((id) => !idToSpecs.has(id));

  // ---- Title-match sync candidates ---------------------------------------
  const updateCandidates = [];
  for (const [titleKey, localMatches] of titleToSpecs) {
    if (localMatches.length !== 1) {
      continue;
    }
    const trMatches = trTitleToCases.get(titleKey) ?? [];
    if (trMatches.length !== 1) {
      continue;
    }

    const localSpec = localMatches[0];
    const trCase = trMatches[0];
    const localIdValue = extractAutomationId(localSpec.annotations);
    const trIdValue = normalizeId(trCase?.[args.testrailField]);

    if (localIdValue && localIdValue !== trIdValue) {
      updateCandidates.push({
        caseId: trCase.id,
        title: trCase.title,
        fromValue: trIdValue,
        toValue: localIdValue,
        filePath: relativeFromRepoRoot(localSpec.file),
      });
    }
  }

  // ---- Report ------------------------------------------------------------
  printSection('Summary');
  console.log(`Tests discovered (Playwright): ${specs.length}`);
  console.log(`  with custom_automation_id:   ${localIds.length}`);
  console.log(`  unannotated:                 ${unannotated.length}`);
  console.log(`  duplicate IDs locally:       ${duplicateIds.length}`);
  console.log(`TestRail cases fetched:        ${testRailCases.length}`);
  console.log(`  with ${args.testrailField}: ${trIds.length}`);
  console.log(`Drift:`);
  console.log(`  local IDs missing in TR:     ${missingInTestRail.length}`);
  console.log(`  TR IDs missing locally:      ${missingInLocal.length}`);
  console.log(`Title-match sync candidates:   ${updateCandidates.length}`);

  if (unannotated.length > 0) {
    printSection('Tests missing custom_automation_id annotation');
    for (const spec of unannotated) {
      console.log(`- ${spec.title}`);
      console.log(`    ${relativeFromRepoRoot(spec.file)}:${spec.line ?? '?'}`);
    }
  }

  if (duplicateIds.length > 0) {
    printSection('Duplicate automation IDs in local tests');
    for (const [id, list] of duplicateIds) {
      console.log(`- ${id}`);
      for (const spec of list) {
        console.log(
          `    ${relativeFromRepoRoot(spec.file)}:${spec.line ?? '?'}  "${spec.title}"`,
        );
      }
    }
  }

  printSection('Local IDs missing in TestRail');
  if (missingInTestRail.length === 0) {
    console.log('None.');
  } else {
    for (const id of missingInTestRail) {
      const locations = uniq(
        (idToSpecs.get(id) ?? []).map((s) => relativeFromRepoRoot(s.file)),
      );
      console.log(`- ${id}`);
      for (const loc of locations) {
        console.log(`    ${loc}`);
      }
    }
  }

  printSection('TestRail IDs missing locally');
  if (missingInLocal.length === 0) {
    console.log('None.');
  } else {
    for (const id of missingInLocal) {
      const cases = trIdToCases.get(id) ?? [];
      const sample = cases[0];
      console.log(`- ${id}  (case ${sample?.id}: ${sample?.title ?? ''})`);
    }
  }

  printSection('Title-match sync candidates');
  if (updateCandidates.length === 0) {
    console.log('None.');
  } else {
    for (const c of updateCandidates) {
      console.log(`- Case ${c.caseId}: ${c.title}`);
      console.log(
        `    ${args.testrailField}: ${c.fromValue || '(empty)'} -> ${c.toValue}`,
      );
      console.log(`    from: ${c.filePath}`);
    }
  }

  // ---- Apply -------------------------------------------------------------
  let applied = { updated: 0, failed: 0 };

  if (args.apply && updateCandidates.length > 0) {
    printSection('Applying updates');
    for (const c of updateCandidates) {
      try {
        await updateTestRailCase({
          host,
          email,
          apiKey,
          caseId: c.caseId,
          fieldName: args.testrailField,
          value: c.toValue,
        });
        applied.updated += 1;
        console.log(`✓ Updated case ${c.caseId} -> ${c.toValue}`);
      } catch (err) {
        applied.failed += 1;
        console.error(
          `✗ Failed to update case ${c.caseId}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    console.log(`\nUpdated: ${applied.updated}  Failed: ${applied.failed}`);
  } else if (!args.apply && updateCandidates.length > 0) {
    console.log(
      '\n(report-only — pass --apply to push these updates to TestRail)',
    );
  }

  if (args.json || args.jsonOut) {
    const summary = {
      mode: args.apply ? 'apply' : 'report',
      counts: {
        specs: specs.length,
        localIds: localIds.length,
        unannotated: unannotated.length,
        duplicates: duplicateIds.length,
        testRailCases: testRailCases.length,
        testRailIds: trIds.length,
        missingInTestRail: missingInTestRail.length,
        missingInLocal: missingInLocal.length,
        updateCandidates: updateCandidates.length,
      },
      missingInTestRail,
      missingInLocal,
      duplicateIds: duplicateIds.map(([id, list]) => ({
        id,
        files: list.map((s) => relativeFromRepoRoot(s.file)),
      })),
      unannotated: unannotated.map((s) => ({
        title: s.title,
        file: relativeFromRepoRoot(s.file),
        line: s.line,
      })),
      updateCandidates,
      applied,
    };
    const json = JSON.stringify(summary, null, 2);

    if (args.json) {
      printSection('JSON summary');
      console.log(json);
    }
    if (args.jsonOut) {
      const outPath = path.resolve(process.cwd(), args.jsonOut);
      await fs.writeFile(outPath, `${json}\n`, 'utf8');
      console.log(`\nJSON summary written to ${outPath}`);
    }
  }

  // ---- Exit code ---------------------------------------------------------
  let exitCode = 0;
  if (args.failOnMissing && missingInTestRail.length > 0) exitCode = 1;
  if (args.failOnDuplicates && duplicateIds.length > 0) exitCode = 1;
  if (args.failOnUnannotated && unannotated.length > 0) exitCode = 1;
  if (applied.failed > 0) exitCode = 1;
  process.exit(exitCode);
}

main().catch((err) => {
  console.error('\nTestRail sync failed.');
  if (err instanceof Error) {
    console.error(err.message);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
  } else {
    console.error(err);
  }
  process.exit(1);
});
