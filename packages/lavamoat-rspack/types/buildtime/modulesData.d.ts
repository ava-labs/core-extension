import type { Module } from '@rspack/core';
import type { InspectableModule } from './policyGenerator.js';
export function analyzeModules({
  mainCompilationWarnings,
  allIdentifiedModules,
  compilerContext,
}: {
  mainCompilationWarnings: Error[];
  allIdentifiedModules: IdentifiedModule[];
  compilerContext?: string;
}): {
  inspectable: InspectableModule[];
  contextModules: {
    moduleId: string | number;
    context: string;
  }[];
  knownPaths: {
    path: string;
    moduleId: string | number;
  }[];
  unenforceableModuleIds: (string | number)[];
  externals: Record<string | number, string>;
};
export type AssetParser = {
  constructor: { name: string };
  dataUrlCondition: boolean;
};
export type IdentifiedModule = {
  module: Module;
  moduleId: string | number | null;
};
