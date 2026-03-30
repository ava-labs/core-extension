/**
 * Rspack's JS `NormalModuleFactory` (`@rspack/core`) only defines
 * `beforeResolve`, `factorize`, `resolve`, `afterResolve`, `createModule`, and
 * `resolveForScheme`. Bundlers with full JS NMF parity also expose
 * `hooks.generator` as a HookMap of `SyncHook<[generator]>` for wrapping JS
 * module codegen (`generate()`).
 *
 * This helper adds that HookMap on the factory instance so taps like
 * `normalModuleFactory.hooks.generator.for('javascript/auto').tap(...)` do not
 * throw.
 *
 * **Important:** Rspack's Rust pipeline may not call these hooks when emitting
 * JavaScript. Taps register; handlers run only if codegen invokes them. Track /
 * contribute upstream:
 * https://github.com/web-infra-dev/rspack
 */

const { HookMap, SyncHook } = require('@rspack/lite-tapable');

const POLYFILL_NAME = 'LavaMoatRspack:NmfGeneratorHooksPolyfill';

/** @param {import('@rspack/core').Compiler} compiler */
function ensureRspackNmfGeneratorHooks(compiler) {
  compiler.hooks.normalModuleFactory.tap(
    POLYFILL_NAME,
    (normalModuleFactory) => {
      if (normalModuleFactory.hooks.generator) {
        return;
      }
      normalModuleFactory.hooks.generator = new HookMap(
        (key) =>
          new SyncHook(
            ['generator'],
            `NormalModuleFactory.hooks.generator.for(${String(key)})`,
          ),
      );
    },
  );
}

module.exports = { ensureRspackNmfGeneratorHooks, POLYFILL_NAME };
