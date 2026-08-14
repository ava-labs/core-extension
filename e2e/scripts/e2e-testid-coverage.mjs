#!/usr/bin/env node
/**
 * E2E feature coverage for core-extension (primary): % of top-level `apps/next/src/pages/<Feature>/` folders
 * “claimed” by at least one Playwright spec via file stem, test.describe title, and test() titles (token match).
 * Does not use data-testid — this is product-area coverage, not selector inventory.
 *
 * Modeled after core-web `QA-add-test-coverage-script` (coverage-model, required-scenarios, testid-coverage JSON + this script).
 *
 * Optional `--testid-inventory`: extra report for data-testid declaration vs getByTestId / `[data-testid=…]` locators.
 *
 * Config JSON: `e2e/<name>.config.json` or `e2e/scripts/<name>.config.json` (testid, required-scenarios, coverage-model).
 *
 * CLI: node e2e/scripts/e2e-testid-coverage.mjs [--json] [--verbose] [--testid-inventory] [--testrail] [--app-dir …] [--e2e-dir …]
 *
 * Optional --testrail: fetch TestRail run/suite for cross-check only; headline coverage is codebaseCompositeCoverage
 * (e2e/coverage-model.config.json) and does not use TestRail.
 *
 * Implementation is split under `e2e/scripts/coverage/`.
 */
import process from 'node:process';
import { main } from './coverage/main.mjs';

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack : err}\n`);
  process.exit(1);
});
