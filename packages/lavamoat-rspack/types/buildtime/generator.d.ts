import type { NormalModule } from '@rspack/core';
import type { ProgressAPI } from './utils.js';

export type Source = import('@rspack/core').sources.Source;

/**
 * Instance tapped by `NormalModuleFactory.hooks.generator` (polyfilled on Rspack when missing).
 * Rspack does not publish an equivalent type on the `@rspack/core` barrel; this shape matches what LavaMoat patches (`generate` + `runtimeRequirements`).
 */
export type JavascriptModuleGenerator = {
  generate(
    module: NormalModule,
    options: {
      runtimeRequirements: Set<string>;
    } & Record<string, unknown>,
  ): Source | null;
};

export function wrapGenerator({
  excludes,
  runChecks,
  PROGRESS,
}: {
  excludes: string[];
  runChecks: boolean | undefined;
  PROGRESS: ProgressAPI;
}): {
  /**
   * @param {object} options
   * @param {(path: string) => string | undefined} options.getIdentifierForPath
   */
  enableGeneratorWrapping({
    getIdentifierForPath,
  }: {
    getIdentifierForPath: (path: string) => string | undefined;
  }): {
    tooEarly: string[];
  };
  /**
   * @param {JavascriptModuleGenerator} generator
   * @returns {JavascriptModuleGenerator}
   */
  generatorHookHandler: (
    generator: JavascriptModuleGenerator,
  ) => JavascriptModuleGenerator;
};
