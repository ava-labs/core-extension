/** @import {Compilation, WebpackPluginInstance} from '@rspack/core' */

const { readFileSync } = require('node:fs');
const {
  sources: { RawSource, ConcatSource },
} = require('@rspack/core');

const lockdownSource = readFileSync(require.resolve('ses'), 'utf-8');
const lockdownSourcePrefix = `/*! SES sources included by LavaMoat. Do not optimize or minify. */\n;\n${lockdownSource}\n;/*! end SES */\n`;

module.exports = {
  /**
   * @param {object} options
   * @param {Compilation} options.compilation
   * @param {RegExp} options.inlineLockdown
   * @returns {() => void}
   */
  sesPrefixFiles:
    ({ compilation, inlineLockdown }) =>
    () => {
      for (const file in compilation.assets) {
        if (!inlineLockdown.test(file)) {
          continue;
        }
        const asset = compilation.assets[file];
        compilation.assets[file] = new ConcatSource(
          lockdownSourcePrefix,
          asset,
        );
      }
    },
  /**
   * @param {object} options
   * @param {Compilation} options.compilation
   * @param {WebpackPluginInstance} [options.htmlTemplatePlugin]
   * @param {boolean} [options.htmlTemplatePluginInterop]
   * @returns {() => void}
   */
  sesEmitHook:
    ({ compilation, htmlTemplatePlugin, htmlTemplatePluginInterop }) =>
    () => {
      // TODO: to consider: instead manually copy to compiler.options.output.path
      const asset = new RawSource(lockdownSource);

      compilation.emitAsset('lockdown', asset);

      if (htmlTemplatePlugin && htmlTemplatePluginInterop) {
        htmlTemplatePlugin.constructor
          // @ts-expect-error - incomplete types
          .getHooks(compilation)
          .beforeEmit.tapAsync(
            'LavaMoatRspackPlugin-lockdown',
            (
              /** @type {{ html: string }} */ data,
              /** @type {(arg0: null, arg1: any) => void} */ cb,
            ) => {
              const scriptTag = '<script src="./lockdown"></script>';
              const headTagRegex = /<head[^>]*>/iu;
              const scriptTagRegex = /<script/iu;

              if (headTagRegex.test(data.html)) {
                data.html = data.html.replace(headTagRegex, `$&${scriptTag}`);
              } else if (scriptTagRegex.test(data.html)) {
                data.html = data.html.replace(scriptTagRegex, `${scriptTag}$&`);
              } else {
                throw Error(
                  'LavaMoatPlugin: Could not insert lockdown script tag, no suitable location found in the html template',
                );
              }
              cb(null, data);
            },
          );
      }
    },
};
