import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { resolveE2eConfigPath } from './config.mjs';
import { readSource, walkTsFiles } from './file-io.mjs';
/**
 * Collect custom_automation_id values from Playwright annotations in source text.
 * @param {string} sourceText
 */
export function extractRepoTestRailAutomationIds(sourceText) {
  const ids = new Set();
  const re = /custom_automation_id:([A-Za-z0-9-]+)/g;
  let m = re.exec(sourceText);
  while (m) {
    ids.add(m[1]);
    m = re.exec(sourceText);
  }
  return [...ids];
}

/**
 * @param {string} e2eTestsDir
 */
export function collectAllRepoTestRailIds(e2eTestsDir) {
  const acc = new Set();
  const files = [];
  walkTsFiles(e2eTestsDir, files, { app: false });
  for (const f of files) {
    if (!f.endsWith('.spec.ts') && !f.endsWith('.spec.tsx')) {
      continue;
    }
    const text = readSource(f);
    for (const id of extractRepoTestRailAutomationIds(text)) {
      acc.add(id);
    }
  }
  return [...acc].sort();
}

/**
 * @param {Record<string, unknown>} caseRow
 * @param {string | undefined} fieldKey env TESTRAIL_AUTOMATION_FIELD overrides
 */
export function getCaseAutomationId(caseRow, fieldKey) {
  if (fieldKey && caseRow[fieldKey]) {
    return String(caseRow[fieldKey]);
  }
  if (caseRow.custom_automation_id) {
    return String(caseRow.custom_automation_id);
  }
  for (const k of Object.keys(caseRow)) {
    if (
      k === 'custom_automation_id' ||
      (k.startsWith('custom_') && k.includes('automation'))
    ) {
      const v = caseRow[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        return String(v);
      }
    }
  }
  return null;
}

/**
 * @returns {Promise<{ ok: boolean, suiteAutomationIds: string[], error?: string }>}
 */
export async function fetchTestRailSuiteAutomationIds() {
  const host = process.env.TESTRAIL_HOST?.replace(/\/$/, '');
  const user = process.env.TESTRAIL_USER;
  const key = process.env.TESTRAIL_API_KEY;
  const projectId = process.env.TESTRAIL_PROJECT_ID;
  const suiteId = process.env.TESTRAIL_SUITE_ID;
  const fieldKey = process.env.TESTRAIL_AUTOMATION_FIELD;
  if (!host || !user || !key || !projectId || !suiteId) {
    return {
      ok: false,
      suiteAutomationIds: [],
      error:
        'Missing one of TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY, TESTRAIL_PROJECT_ID, TESTRAIL_SUITE_ID',
    };
  }
  const auth = Buffer.from(`${user}:${key}`).toString('base64');
  const ids = new Set();
  let offset = 0;
  while (true) {
    const u = new URL(`${host}/index.php?/api/v2/get_cases/${projectId}`);
    u.searchParams.set('suite_id', suiteId);
    u.searchParams.set('limit', '250');
    u.searchParams.set('offset', String(offset));
    const res = await fetch(u, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) {
      const errText = await res.text();
      return {
        ok: false,
        suiteAutomationIds: [],
        error: `${res.status} ${errText.slice(0, 500)}`,
      };
    }
    /** @type {{ cases?: Record<string, unknown>[] }} */
    const data = await res.json();
    const batch = data.cases ?? [];
    for (const c of batch) {
      const aid = getCaseAutomationId(c, fieldKey);
      if (aid) {
        ids.add(aid.trim());
      }
    }
    if (batch.length < 250) {
      break;
    }
    offset += 250;
  }
  return { ok: true, suiteAutomationIds: [...ids].sort() };
}

/**
 * @returns {{ host: string, authHeader: string } | null}
 */
export function getTestRailAuth() {
  const host = process.env.TESTRAIL_HOST?.replace(/\/$/, '');
  const user = process.env.TESTRAIL_USER;
  const key = process.env.TESTRAIL_API_KEY;
  if (!host || !user || !key) {
    return null;
  }
  const authHeader = `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}`;
  return { host, authHeader };
}

/**
 * TestRail run stats: pass+fail = executed in run (automated); untested = not executed in this run.
 * @param {string} host
 * @param {string} authHeader
 * @param {string | number} runId
 * @returns {Promise<{ ok: true } & Record<string, unknown> | { ok: false, error: string }>}
 */
export async function fetchTestRailRunExecution(host, authHeader, runId) {
  const u = `${host}/index.php?/api/v2/get_run/${runId}`;
  const res = await fetch(u, { headers: { Authorization: authHeader } });
  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, error: `${res.status} ${errText.slice(0, 500)}` };
  }
  /** @type {Record<string, unknown>} */
  const run = await res.json();
  const passed = Number(run.passed_count ?? 0);
  const failed = Number(run.failed_count ?? 0);
  const untested = Number(run.untested_count ?? 0);
  const blocked = Number(run.blocked_count ?? 0);
  const retest = Number(run.retest_count ?? 0);
  let testsCount = Number(run.tests_count ?? 0);
  if (!testsCount) {
    testsCount = passed + failed + untested + blocked + retest;
  }
  const executed = passed + failed;
  const percent =
    testsCount === 0 ? 0 : Math.round((executed / testsCount) * 10000) / 100;
  return {
    ok: true,
    runId: Number(run.id ?? runId),
    suiteId: run.suite_id,
    testsCount,
    passedCount: passed,
    failedCount: failed,
    untestedCount: untested,
    blockedCount: blocked,
    retestCount: retest,
    executedPassFailCount: executed,
    percentPassFailOfRunTests: percent,
  };
}

/**
 * Optional snapshot when API cannot be called (paste counts from TestRail run summary).
 * @param {string} e2eDir
 */
export function loadTestRailRunReference(e2eDir) {
  const p = resolveE2eConfigPath(e2eDir, 'testrail-run-reference.json');
  if (!fs.existsSync(p)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {unknown} raw
 * @returns {Record<string, unknown> | null}
 */
export function normalizeTestRailRunReference(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const o = /** @type {Record<string, unknown>} */ (raw);
  const runId = o.runId ?? o.run_id;
  const testsCount = Number(o.testsCount ?? o.tests_count ?? 0);
  const passed = Number(o.passedCount ?? o.passed_count ?? 0);
  const failed = Number(o.failedCount ?? o.failed_count ?? 0);
  if (runId === undefined || runId === null || testsCount <= 0) {
    return null;
  }
  const executed = passed + failed;
  const percent =
    testsCount === 0 ? 0 : Math.round((executed / testsCount) * 10000) / 100;
  return {
    runId: Number(runId),
    testsCount,
    passedCount: passed,
    failedCount: failed,
    untestedCount: Number(
      o.untestedCount ?? o.untested_count ?? Math.max(0, testsCount - executed),
    ),
    blockedCount: Number(o.blockedCount ?? o.blocked_count ?? 0),
    retestCount: Number(o.retestCount ?? o.retest_count ?? 0),
    executedPassFailCount: executed,
    percentPassFailOfRunTests: percent,
  };
}
