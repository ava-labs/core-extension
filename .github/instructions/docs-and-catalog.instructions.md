---
applyTo: 'apps/**,packages/**,build-scripts/**,.github/workflows/**'
---

This repo's docs (`docs/`) and Backstage descriptor (`catalog-info.yaml`) are published in the Core service catalogue. When a PR changes behaviour, check they still match, and leave a review comment naming the file and section that is now stale if they don't. Flag in particular:

- New or changed backend calls, or env-var base URLs (a new fetch to a Core service, or a new third party) → `consumesApis` / `dependsOn` in `catalog-info.yaml` and the backend dependencies / third parties tables and flowchart in `docs/index.md`. A new third party also needs an `external-service` Resource in `catalog/external.yaml` of the service-catalogue repo.
- Release workflows (`.github/workflows/main_branch.yaml`, `.github/workflows/create_release.yaml`), `.releaserc.js`, `build-scripts/submitBuild.mjs` → `docs/release.md`.
- Dev setup commands, Node version or env files → `docs/development.md` (and `CLAUDE.md` if it repeats them).
- Architecture changes → the matching numbered page in `docs/` (for example `01-Architecture.md` or `02-Service-worker.md`).

Links between docs pages must be relative and stay inside `docs/`, so they work on GitHub and in Backstage.

Don't ask for doc changes on pure refactors, tests or dependency bumps.
