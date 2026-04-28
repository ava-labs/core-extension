export = LavaMoatPlugin;
declare class LavaMoatPlugin {
  /**
   * @param {LavaMoatPluginOptions} [options]
   */
  constructor(options?: LavaMoatPluginOptions);
  /** @type {CompleteLavaMoatPluginOptions} */
  options: CompleteLavaMoatPluginOptions;
  /**
   * @param {import('@rspack/core').Compiler} compiler The compiler instance
   * @returns {void}
   */
  apply(compiler: import('@rspack/core').Compiler): void;
}
declare namespace LavaMoatPlugin {
  export { LavaMoatPlugin, EXCLUDE_LOADER as exclude, LavaMoatPluginOptions };
}
import type { CompleteLavaMoatPluginOptions } from './buildtime/types';
declare const EXCLUDE_LOADER: string;
/**
 * This is jsdoc for reexport
 */
type LavaMoatPluginOptions = import('./buildtime/types').LavaMoatPluginOptions;
