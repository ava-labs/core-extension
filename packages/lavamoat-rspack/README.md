# LavaMoat Rspack Plugin

A supply-chain security plugin for Rspack that sandboxes every npm dependency at build time. Each package in the bundle runs inside a [SES Compartment](https://github.com/endojs/endo/tree/master/packages/ses#compartment) and can only access the globals and packages explicitly allowed by a security policy.

This is a port of the upstream [@lavamoat/webpack](https://github.com/LavaMoat/LavaMoat/tree/main/packages/webpack) plugin, adapted for Rspack's Rust-based codegen pipeline.

## How it works

The plugin runs across three phases of the Rspack build lifecycle: **pre-compilation**, **compilation**, and **asset emission**. At page load, a fourth phase — **runtime execution** — takes over in the browser.

### Phase 1: Pre-compilation (canonical name map)

**Hook:** `compiler.hooks.beforeRun`

Before any compilation starts, the plugin builds a **canonical name map** — a lookup table that maps every `node_modules` directory on disk to a canonical package identity (e.g. `@sentry/browser>@sentry/core`).

This is done by [`@lavamoat/aa`](https://github.com/LavaMoat/LavaMoat/tree/main/packages/aa), which walks the dependency tree from the project root using `browser-resolve`. The map includes devDependencies because they often end up in bundles.

The canonical name map is the single source of truth for "which file belongs to which package" throughout the rest of the build.

### Phase 2: Compilation (analysis → policy → wrapping → runtime injection)

**Hook:** `compiler.hooks.thisCompilation`

This is the main phase, with four sub-steps that run in sequence.

#### Step 2a: Forced configuration

The plugin forces `optimization.concatenateModules = false`. Module concatenation merges modules from different packages into one scope, which would defeat per-package sandboxing.

#### Step 2b: Module analysis and policy generation

**Hook:** `RsdoctorPlugin.getCompilationHooks(compilation).moduleIds`

After Rspack assigns module IDs (in Rust), the Rsdoctor builtin emits a `moduleIds` event. The plugin uses this as its entry point because module IDs are now stable and codegen hasn't been finalized yet.

The plugin then:

1. **Classifies every module** in the compilation (`modulesData.js`):

   - _Inspectable_ — normal JS modules with a file path (will be policy-checked and wrapped)
   - _Unenforceable_ — webpack-ignored builtins (e.g. `require('crypto')` → `?0b7d`), context modules, or external modules that can't be mapped to a package
   - _Excluded_ — modules explicitly marked with the `LavaMoatPlugin.exclude` loader

2. **Maps file paths to package names** using the canonical name map from Phase 1. For monorepo setups where the same package is installed in multiple `node_modules` directories, a walk-up fallback resolves nested copies to their canonical identity (`canonicalPackageName.js`).

3. **Generates (or loads) the security policy** (`policyGenerator.js`):

   - When `generatePolicy: true`, the plugin feeds each module's source code and its import connections into `lavamoat-core`'s `createModuleInspector`. The inspector performs static analysis to detect which globals each package reads/writes and which other packages it imports. The result is written to `policy.json`.
   - When `generatePolicy: false`, the plugin loads an existing `policy.json` from `policyLocation`.
   - In both cases, `policy-override.json` (if present) is merged on top to allow manual tweaks.

4. **Checks for SES-incompatible code.** During inspection, `lavamoat-core` detects patterns like primordial mutations (`Object.keys = ...`), strict mode violations, and dynamic `require()`. Packages listed in `knownIncompatiblePackages` are silently suppressed; any unlisted package with violations causes a build error.

5. **Builds an identifier lookup** (`aa.js`) that maps each numeric/string module ID to a human-readable or numeric resource ID. This lookup is embedded in the runtime so it can resolve "module 42 belongs to package X" at execution time.

#### Step 2c: Module source wrapping

**Hook:** `RsdoctorPlugin.getCompilationHooks(compilation).moduleSources`

This is the critical step that Rspack requires a workaround for. In webpack, the plugin hooks into `NormalModuleFactory` generator hooks to wrap module source during codegen. Rspack runs JS codegen in Rust, so those hooks never fire.

Instead, the plugin intercepts the **Rsdoctor `moduleSources`** hook, which fires after Rspack's Rust codegen has produced the JS source for each module. For every JS module that isn't excluded or unenforceable:

1. The module's resource ID is looked up from its file path.
2. The module's runtime requirements are inferred (which webpack globals it needs: `__webpack_require__`, `module`, `exports`, etc.).
3. The source is transformed for SES compatibility using `lavamoat-core`'s `applySourceTransforms`.
4. The source is wrapped in a **triple-`with` closure** (`wrapper.js`):

```js
(function () {
  if (!this.scopeTerminator) return () => {};
  with (this.scopeTerminator) {
    with (this.runtimeHandler) {
      with (this.globalThis) {
        return function () {
          'use strict';
          // ← original module source goes here
        };
      }
    }
  }
}).call(evalKit('package-name', { __webpack_require__, module, exports }))();
```

This closure creates a layered scope chain:

- **`scopeTerminator`** — a Proxy whose `has` trap returns `true` for everything, preventing the module from reaching into the outer bundler scope
- **`runtimeHandler`** — provides the module's `__webpack_require__` (wrapped with policy enforcement), `module`, and `exports`
- **`globalThis`** — the Compartment's isolated global object, populated only with the globals the policy allows

The `evalKit` function (assigned to `__webpack_require__._LM_` at runtime) creates or reuses a Compartment for the package, installs its allowed globals, and returns the frozen scope chain objects.

#### Step 2d: Runtime injection

**Hook:** `compilation.hooks.additionalTreeRuntimeRequirements`

For each chunk that has a runtime (entry chunks), the plugin injects **VirtualRuntimeModules** into the chunk. These are synthetic Rspack runtime modules whose source is assembled at build time from multiple fragments:

| Fragment                    | Source                                | Purpose                                                                                         |
| --------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **defensive preamble**      | generated                             | Caches `location`, `setTimeout`, `document`, etc. before scuttling can remove them              |
| **LOCKDOWN_SHIMS**          | generated                             | Array for static shims to register themselves                                                   |
| **static shims** (optional) | user-provided files                   | Code that runs between `repairIntrinsics` and `hardenIntrinsics`, e.g. polyfills for intrinsics |
| **root**                    | JSON                                  | The resource ID of the root package                                                             |
| **idmap**                   | JSON                                  | `[resourceId, [moduleId, ...]][]` — maps resource IDs to their module IDs                       |
| **unenforceable**           | JSON                                  | Module IDs that bypass policy enforcement                                                       |
| **ctxm**                    | JSON                                  | Context module IDs (webpack's `require.context`)                                                |
| **kch**                     | JSON                                  | Known chunk IDs (prevents loading unknown chunks at runtime)                                    |
| **externals**               | JSON                                  | External module ID → name mapping                                                               |
| **options**                 | JSON                                  | Lockdown options, scuttling config                                                              |
| **scuttling** (optional)    | `lavamoat-core/src/scuttle.js`        | Scuttles `globalThis` if configured                                                             |
| **policy**                  | JSON                                  | The full policy object                                                                          |
| **ENUM**                    | JSON                                  | Key names used by the wrapper (`scopeTerminator`, `runtimeHandler`, `globalThis`)               |
| **endowmentsToolkit**       | `lavamoat-core`                       | Functions for building per-package globals from the policy                                      |
| **repairs**                 | generated from `src/runtime/repairs/` | Fixes for browser APIs that break under SES (e.g. `MessageEvent`, `addEventListener`)           |
| **runtime**                 | `src/runtime/runtime.js`              | The main LavaMoat runtime (see Phase 4)                                                         |
| **debug** (optional)        | `src/runtime/debug.js`                | Proxy-based helpers for detecting missing endowments                                            |

These fragments are concatenated into a single source string using a shared `LAVAMOAT` namespace object, then registered as Rspack `RuntimeModule` instances that Rspack includes in the chunk's runtime bootstrap.

### Phase 3: Asset emission (SES lockdown)

**Hook:** `compilation.hooks.processAssets`

The plugin emits the [SES lockdown](https://github.com/endojs/endo/tree/master/packages/ses#lockdown) script. This is the `ses` package's source code, unmodified and unminified (minification would break its security guarantees). There are two modes:

- **External file** (default): Emitted as `dist/lockdown` (no `.js` extension, to prevent minifiers from processing it). If `htmlTemplatePluginInterop` is enabled, a `<script src="./lockdown">` tag is injected into the HTML output before all other scripts.
- **Inline** (`inlineLockdown: /pattern/`): The lockdown source is prepended to output files matching the regex.

The lockdown script **must execute before any bundle code**. It installs `repairIntrinsics` and `hardenIntrinsics` on `globalThis`, which the LavaMoat runtime calls during Phase 4.

### Phase 4: Runtime execution (in the browser)

When the page loads in the extension:

1. **`lockdown` script runs** — installs SES primitives (`repairIntrinsics`, `hardenIntrinsics`, `Compartment`, `harden`) on `globalThis`.

2. **Rspack runtime bootstrap executes**, which includes the LavaMoat runtime modules:

   a. **Defensive preamble** — caches essential globals (`location`, `setTimeout`, `document`, `self`) in local variables so they survive scuttling.

   b. **Static shims** run (if any), registered into the frozen `LOCKDOWN_SHIMS` array.

   c. **Main LavaMoat runtime** (`runtime.js`) executes:

   - Calls `repairIntrinsics(lockdownOptions)` — patches known platform bugs
   - Runs all `LOCKDOWN_SHIMS`
   - Calls `hardenIntrinsics()` — **freezes all JavaScript intrinsics** (`Object`, `Array`, `Promise`, `Function.prototype`, etc.)
   - Initializes the endowments toolkit from `lavamoat-core`
   - Scans the policy for globals with `"write"` permission
   - Creates a `stricterScopeTerminator` Proxy that traps all property lookups (prevents modules from reaching bundler-scope variables)
   - Exposes `lavamoatRuntimeWrapper` as `__webpack_require__._LM_` — this is the `evalKit` function that wrapped modules call

3. **Each wrapped module executes.** When Rspack's `__webpack_require__` loads a module, the wrapped closure calls `__webpack_require__._LM_(resourceId, runtimeKit)`, which:

   - Creates a new `Compartment` for the package (or reuses an existing one)
   - Calls `installGlobalsForPolicy` to populate the Compartment's `globalThis` with only the globals the policy allows (via `getEndowmentsForConfig` from `lavamoat-core`)
   - Applies browser API repairs to the compartment's endowments
   - Returns a frozen object with `{ scopeTerminator, runtimeHandler, globalThis }`
   - The triple-`with` closure uses these to create the module's restricted execution scope

4. **Policy enforcement on `require`.** The `__webpack_require__` passed to each module is wrapped by `wrapRequireWithPolicy`. When module A tries to import module B:

   - The wrapper resolves B's module ID to a resource ID using the `idmap`
   - It checks A's policy entry in `policy.resources[A].packages` for permission to import B
   - If allowed, the original `__webpack_require__` is called
   - If denied, a `Policy does not allow importing B from A` error is thrown
   - The root package implicitly has permission to import anything

5. **Chunk loading enforcement.** The wrapped `__webpack_require__.e` only allows loading chunk IDs that were known at compile time (from the `kch` list), preventing runtime manipulation of chunk loading paths.

6. **GlobalThis scuttling** (optional). If `scuttleGlobalThis` is enabled, after the root Compartment's globals are set up, all properties on the real `globalThis` are removed (except configured exceptions). This means even if a package somehow obtains a reference to the real `globalThis`, it finds nothing useful there.

## Rspack vs Webpack: key differences

| Concern             | Webpack plugin                                     | Rspack plugin                                                       |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| Module wrapping     | `NormalModuleFactory` generator hooks (JS codegen) | Rsdoctor `moduleSources` hook (post-Rust codegen)                   |
| Rsdoctor dependency | Not needed                                         | Required — forces a minimal `RsdoctorPlugin` builtin if not present |
| NMF generator hooks | Native                                             | Polyfilled via `ensureRspackNmfGeneratorHooks.js`                   |
| Module ID timing    | Available during codegen                           | Available via Rsdoctor `moduleIds` hook before `moduleSources`      |

## HMR compatibility

LavaMoat is **not compatible with Hot Module Replacement**. HMR requires mutating module state at runtime, which is the antithesis of compartment-based sandboxing. Disable LavaMoat in development builds if you need HMR. You can still include the lockdown script alone to detect SES incompatibilities early.
