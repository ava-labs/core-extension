import type { CanonicalNameMap } from '@lavamoat/aa';
import type { LavaMoatPolicy } from '@lavamoat/types';
import type { Compilation } from '@rspack/core';
import { jsonStringifySortedPolicy } from 'lavamoat-core/types/src';

/** Rspack module graph connection (class exists in Rspack but is not on the public `@rspack/core` barrel; element type of `compilation.moduleGraph.getOutgoingConnections()`). */
type RspackModuleGraphConnection = ReturnType<
  InstanceType<typeof Compilation>['moduleGraph']['getOutgoingConnections']
>[number];

declare namespace _exports {
  export { IsBuiltinFn, InspectableModule };
}
declare namespace _exports {
  export { jsonStringifySortedPolicy as stringifyPolicyReliably };
  /**
   * @param {Object} opts
   * @param {LavaMoatPolicy | undefined} opts.policyFromOptions
   * @param {string} opts.location
   * @returns {LavaMoatPolicy}
   */
  export function loadPolicy({
    policyFromOptions,
    location,
  }: {
    policyFromOptions: LavaMoatPolicy | undefined;
    location: string;
  }): LavaMoatPolicy;
  /**
   * @param {Object} opts
   * @param {CanonicalNameMap} opts.canonicalNameMap - Generated from aa
   * @param {string} opts.location - Where to read/write the policy files
   * @param {IsBuiltinFn} opts.isBuiltin - A function that determines if the
   *   specifier is a builtin of the runtime platform e.g. node:fs
   * @returns
   */
  /**
   * @typedef {{
   *   module: InspectableModule
   *   connections: Iterable<RspackModuleGraphConnection>
   * }} ModuleWithConnections
   *
   *
   * @typedef {ResourceMetadata & Record<string, string[]>} ReexportMetaRecord
   */
  /**
   * @param {Object} opts
   * @param {CanonicalNameMap} opts.canonicalNameMap
   * @param {string} opts.location
   * @param {IsBuiltinFn} opts.isBuiltin
   * @param {ModuleWithConnections[]} opts.modulesToInspect
   * @returns {LavaMoatPolicy}
   */
  export function generatePolicy({
    canonicalNameMap,
    location,
    isBuiltin,
    modulesToInspect,
  }: {
    canonicalNameMap: CanonicalNameMap;
    location: string;
    isBuiltin: IsBuiltinFn;
    modulesToInspect: {
      module: InspectableModule;
      connections: Iterable<RspackModuleGraphConnection>;
    }[];
  }): LavaMoatPolicy;
}
export = _exports;
type IsBuiltinFn = (specifier: string) => boolean;
type InspectableModule =
  | import('@rspack/core').NormalModule
  | import('@rspack/core').ExternalModule;
