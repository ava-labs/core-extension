declare namespace _exports {
  export { LavaMoatRuntimeIdentifiers };
}
declare namespace _exports {
  /**
   * Builds the LavaMoat runtime configuration and generates runtime source code
   *
   * @param {Object} params The parameters object
   * @param {LavaMoatPluginOptions} params.options Runtime configuration options
   */
  function runtimeBuilder({ options }: { options: LavaMoatPluginOptions }): {
    /**
     * Generates the LavaMoat runtime source code based on chunk configuration
     *
     * @param {Object} params The parameters object
     * @param {ProgressAPI} params.PROGRESS
     * @param {Chunk} params.currentChunk The compilation chunk
     * @param {(string | number)[]} params.chunkIds Array of chunk identifiers
     * @param {LavaMoatPolicy} params.policyData LavaMoat security policy
     *   configuration
     * @param {LavaMoatRuntimeIdentifiers} params.identifiers Object
     *   containing module identifier mappings
     * @param {string} params.chunkLoaderName The name of the global that
     *   loads chunks
     * @returns {VirtualRuntimeModule[]} The assembled runtime source code
     */
    getLavaMoatRuntimeModules({
      PROGRESS,
      currentChunk,
      chunkIds,
      policyData,
      identifiers,
      chunkLoaderName,
    }: {
      PROGRESS: ProgressAPI;
      currentChunk: Chunk;
      chunkIds: (string | number)[];
      policyData: LavaMoatPolicy;
      identifiers: LavaMoatRuntimeIdentifiers;
      chunkLoaderName: string;
    }): VirtualRuntimeModule[];
  };
}
export = _exports;
type LavaMoatRuntimeIdentifiers = {
  /**
   * Root identifier
   */
  root: string;
  /**
   * Module ID
   * to identifier mappings
   */
  identifiersForModuleIds: [string, (string | number)[]][];
  /**
   * IDs of modules that
   * cannot be enforced
   */
  unenforceableModuleIds: (string | number)[];
  /**
   * Context module IDs
   */
  contextModuleIds?: (string | number)[] | undefined;
  /**
   * External module
   * configurations
   */
  externals?: Record<string | number, string> | undefined;
};
import type { LavaMoatPluginOptions } from '../buildtime/types';
declare class VirtualRuntimeModule extends RuntimeModule {
  /**
   * @param {Object} options The options for the VirtualRuntimeModule.
   * @param {string} options.name The name of the module.
   * @param {string} options.source The source code of the module.
   * @param {number} [options.stage] The stage of runtime. One of
   *   RuntimeModule.STAGE_*.
   * @param {boolean} [options.withoutClosure] Make the source code run outside
   *   the closure for a runtime module
   */
  constructor({
    name,
    source,
    stage,
    withoutClosure,
  }: {
    name: string;
    source: string;
    stage?: number | undefined;
    withoutClosure?: boolean | undefined;
  });
  withoutClosure: boolean;
  virtualSource: string;
  /**
   * Returns the virtual source code.
   *
   * @returns {string} Virtual source code string
   * @override
   */
  override generate(): string;
}
import type { ProgressAPI } from '../buildtime/utils.js';
import type { Chunk } from '@rspack/core';
import type { LavaMoatPolicy } from '@lavamoat/types';
import { RuntimeModule } from '@rspack/core';
