#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Inject TestRail `test_id` properties into a Playwright JUnit report.
 *
 * trcli ≥ 1.16 only skips section handling when every result already carries a
 * TestRail case id (`all_cases_have_ids`). Playwright annotates each test with
 * our stable `custom_automation_id` slug but not the TestRail case id, so this
 * step reads the committed `automation_id → case id` map (see
 * `testrail-sync.mjs --emit-map`) and writes a `<property name="test_id">` onto
 * every testcase before upload. Combined with `trcli --case-matcher property`,
 * trcli then matches existing cases by id and never tries to create the
 * spec-file-named sections it would otherwise derive from the testsuite names.
 *
 * Fails closed: if any testcase lacks a `custom_automation_id`, or its id is
 * absent from the map, the script exits non-zero so an unmapped test surfaces
 * as a loud CI error instead of silently reopening the section-creation path.
 *
 * Usage:
 *   node scripts/inject-testrail-ids.mjs <junit-report.xml> <map.json>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function normalizeId(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase();
}

// A single testcase element. The self-closing form is listed first so a
// `<testcase ... />` never falls into the container alternative, which would
// otherwise consume `[\s\S]*?` up to the next `</testcase>` and swallow the
// following case (letting it evade validation).
const TESTCASE_RE =
  /<testcase\b[^>]*\/>|<testcase\b[^>]*>[\s\S]*?<\/testcase>/g;
// Counts opening tags independently so we can assert every testcase was visited.
const TESTCASE_OPEN_RE = /<testcase\b/g;
const TESTCASE_NAME_RE = /<testcase\b[^>]*?\bname="([^"]*)"/;
// All annotation scanning is scoped to this block so text inside <system-out>
// / <system-err> (including CDATA) can never be mistaken for a property.
const PROPERTIES_RE = /<properties>[\s\S]*?<\/properties>/;
const PROPERTIES_CLOSE_RE = /([ \t]*)<\/properties>/;
// Playwright (embedAnnotationsAsProperties) serializes properties as either an
// open/close pair or a self-closing element; capture leading indent to mirror it.
const AUTOMATION_ID_RE =
  /([ \t]*)<property name="testrail_case_field" value="custom_automation_id:([^"]+)"\s*(?:\/>|>[ \t\r\n]*<\/property>)/;
const TEST_ID_RE =
  /<property name="test_id" value="([^"]*)"\s*(?:\/>|>[ \t\r\n]*<\/property>)/;

function main() {
  const [, , junitPath, mapPath] = process.argv;
  if (!junitPath || !mapPath) {
    console.error(
      'Usage: node scripts/inject-testrail-ids.mjs <junit-report.xml> <map.json>',
    );
    process.exit(2);
  }

  const junitAbs = path.resolve(process.cwd(), junitPath);
  const mapAbs = path.resolve(process.cwd(), mapPath);

  if (!fs.existsSync(junitAbs)) {
    console.error(`JUnit report not found: ${junitAbs}`);
    process.exit(2);
  }
  if (!fs.existsSync(mapAbs)) {
    console.error(`Case-id map not found: ${mapAbs}`);
    process.exit(2);
  }

  const rawMap = JSON.parse(fs.readFileSync(mapAbs, 'utf8'));
  const map = new Map(
    Object.entries(rawMap).map(([key, value]) => [normalizeId(key), value]),
  );

  const xml = fs.readFileSync(junitAbs, 'utf8');

  let injected = 0;
  let alreadyPresent = 0;
  let visited = 0;
  const problems = [];

  const out = xml.replace(TESTCASE_RE, (block) => {
    visited += 1;
    const name = block.match(TESTCASE_NAME_RE)?.[1] ?? '(unknown testcase)';

    const props = block.match(PROPERTIES_RE)?.[0];
    if (!props) {
      problems.push(`${name}: no <properties> block`);
      return block;
    }

    const automation = props.match(AUTOMATION_ID_RE);
    if (!automation) {
      problems.push(`${name}: no custom_automation_id annotation`);
      return block;
    }

    const [, indent, rawAutomationId] = automation;
    const automationId = normalizeId(rawAutomationId);
    const caseId = map.get(automationId);
    if (caseId === undefined) {
      problems.push(`${name}: automation id ${automationId} not found in map`);
      return block;
    }
    const expected = `C${caseId}`;

    const existing = props.match(TEST_ID_RE);
    if (existing) {
      if (normalizeId(existing[1]) === normalizeId(expected)) {
        alreadyPresent += 1;
        return block;
      }
      problems.push(
        `${name}: existing test_id ${existing[1]} does not match expected ${expected}`,
      );
      return block;
    }

    const newProps = props.replace(
      PROPERTIES_CLOSE_RE,
      (_closeMatch, closeIndent) =>
        `${indent}<property name="test_id" value="${expected}">\n` +
        `${indent}</property>\n${closeIndent}</properties>`,
    );
    injected += 1;
    return block.replace(props, newProps);
  });

  const totalTestcases = (xml.match(TESTCASE_OPEN_RE) ?? []).length;
  if (visited !== totalTestcases) {
    console.error(
      `Testcase coverage mismatch in ${junitPath}: matched ${visited} of ` +
        `${totalTestcases} <testcase> element(s). The report may be malformed.`,
    );
    process.exit(1);
  }

  if (problems.length > 0) {
    console.error(
      `Cannot inject test_id for ${problems.length} testcase(s) in ${junitPath}:`,
    );
    for (const problem of problems) {
      console.error(`  - ${problem}`);
    }
    console.error(
      '\nRegenerate the map with `yarn testrail:map` after every TestRail case ' +
        'is reachable by its automation id, then re-run.',
    );
    process.exit(1);
  }

  fs.writeFileSync(junitAbs, out, 'utf8');
  console.log(
    `Injected test_id into ${injected} testcase(s) in ${junitPath}` +
      (alreadyPresent ? ` (${alreadyPresent} already had one)` : ''),
  );
}

main();
