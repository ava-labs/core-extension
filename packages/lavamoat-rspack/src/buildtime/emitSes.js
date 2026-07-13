/** @import {Compilation, WebpackPluginInstance} from '@rspack/core' */

const { readFileSync } = require('node:fs');
const {
  sources: { RawSource, ConcatSource },
} = require('@rspack/core');

const lockdownSource = readFileSync(require.resolve('ses'), 'utf-8');
const lockdownSourcePrefix = `/*! SES sources included by LavaMoat. Do not optimize or minify. */\n;\n${lockdownSource}\n;/*! end SES */\n`;

// ConcatSource places the original asset right after the prefix's final
// newline, so the asset's first line moves down by exactly this many lines.
const PREFIX_LINE_COUNT = (lockdownSourcePrefix.match(/\n/g) || []).length;

const INLINE_MAP_MARKER = '//# sourceMappingURL=data:application/json';
const BASE64_MARKER = 'base64,';

/**
 * Prepends empty lines to a source map's `mappings` so every mapping shifts
 * down by `lineCount`. Mappings are line-delimited by `;`, so prepending
 * `lineCount` semicolons inserts that many unmapped lines at the top without
 * touching any VLQ segments.
 *
 * @param {string} mapJson
 * @param {number} lineCount
 * @returns {string}
 */
function shiftSourceMapDown(mapJson, lineCount) {
  const map = JSON.parse(mapJson);
  if (typeof map.mappings === 'string') {
    map.mappings = ';'.repeat(lineCount) + map.mappings;
  }
  return JSON.stringify(map);
}

/**
 * Extracts the chunk's own inline source map from an asset's content.
 *
 * rspack appends the map as a `//# sourceMappingURL=` data URI on the asset's
 * final line. Bundled dependencies (e.g. `@metamask/rpc-errors`) can ship their
 * own inline maps embedded mid-file, so matching the marker anywhere would grab
 * a dependency's map instead. We only accept the marker when it is the last
 * line (nothing but whitespace follows) and read just that line — never to EOF.
 *
 * @param {string} content
 * @returns {{ body: string, mapJson: string } | undefined}
 */
function extractTrailingInlineMap(content) {
  let end = content.length;
  while (end > 0 && /\s/.test(content[end - 1])) {
    end--;
  }
  const lineStart = content.lastIndexOf('\n', end - 1) + 1;
  const lastLine = content.slice(lineStart, end);
  if (!lastLine.startsWith(INLINE_MAP_MARKER)) {
    return undefined;
  }
  const b64Idx = lastLine.indexOf(BASE64_MARKER);
  if (b64Idx === -1) {
    return undefined;
  }
  return {
    body: content.slice(0, lineStart),
    mapJson: Buffer.from(
      lastLine.slice(b64Idx + BASE64_MARKER.length),
      'base64',
    ).toString('utf-8'),
  };
}

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
        const content = asset.source().toString();

        // Inline source map (dev): the map is baked into the asset content as
        // a trailing data URI. The devtool stage runs before this one, so the
        // embedded mappings have no idea the lockdown prefix is coming.
        const inline = extractTrailingInlineMap(content);
        if (inline) {
          const shifted = shiftSourceMapDown(inline.mapJson, PREFIX_LINE_COUNT);
          const rebuilt =
            lockdownSourcePrefix +
            inline.body +
            INLINE_MAP_MARKER +
            ';charset=utf-8;' +
            BASE64_MARKER +
            Buffer.from(shifted, 'utf-8').toString('base64');
          compilation.updateAsset(file, new RawSource(rebuilt));
          continue;
        }

        // External source map (prod hidden-source-map): the JS asset has a
        // sibling `.map` asset whose mappings must shift by the same amount.
        const related = asset.info && asset.info.related;
        const mapFile =
          related && typeof related.sourceMap === 'string'
            ? related.sourceMap
            : undefined;
        compilation.updateAsset(
          file,
          new ConcatSource(lockdownSourcePrefix, asset),
        );
        if (mapFile && compilation.assets[mapFile]) {
          const shifted = shiftSourceMapDown(
            compilation.assets[mapFile].source().toString(),
            PREFIX_LINE_COUNT,
          );
          compilation.updateAsset(mapFile, new RawSource(shifted));
        }
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
