export function generateIdentifierLookup({
  paths,
  policy,
  canonicalNameMap,
  contextModules,
  readableResourceIds,
}: {
  paths: {
    path: string;
    moduleId: string | number;
  }[];
  policy: LavaMoatPolicy;
  canonicalNameMap: CanonicalNameMap;
  contextModules: {
    moduleId: string | number;
    context: string;
  }[];
  externals: Record<string | number, string>;
  readableResourceIds: boolean | undefined;
}): IdentifierLookup;
export type IdentifierLookup = {
  root: string;
  identifiersForModuleIds: [string, (string | number)[]][];
  pathToResourceId: (path: string) => string | undefined;
  isKnownPath: (path: string) => boolean;
  policyIdentifierToResourceId: (id: string) => string;
  getTranslatedPolicy: () => LavaMoatPolicy;
};
import type { LavaMoatPolicy } from '@lavamoat/types';
import type { CanonicalNameMap } from '@lavamoat/aa';
