/**
 * Standalone plugin: installs `NormalModuleFactory.hooks.generator` when
 * missing (Rspack). No-op if `hooks.generator` already exists.
 *
 * Normally you do not need this: `LavaMoatRspackPlugin` calls
 * `ensureRspackNmfGeneratorHooks` automatically. Use this if another plugin
 * runs before LavaMoat and requires `hooks.generator` during
 * `compiler.hooks.normalModuleFactory`.
 *
 * @see ./ensureRspackNmfGeneratorHooks.js
 */

const {
  ensureRspackNmfGeneratorHooks,
} = require('./ensureRspackNmfGeneratorHooks.js');

const PLUGIN = 'RspackNmfGeneratorHookPolyfillPlugin';

class RspackNmfGeneratorHookPolyfillPlugin {
  /** @param {import('@rspack/core').Compiler} compiler */
  apply(compiler) {
    ensureRspackNmfGeneratorHooks(compiler);
  }
}

module.exports = RspackNmfGeneratorHookPolyfillPlugin;
module.exports.RspackNmfGeneratorHookPolyfillPlugin =
  RspackNmfGeneratorHookPolyfillPlugin;
module.exports.PLUGIN_NAME = PLUGIN;
