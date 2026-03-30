import type { NormalModule } from '@rspack/core';
import type { InspectableModule } from './policyGenerator';
export function isExcluded(module: NormalModule): boolean;
export function isExcludedUnsafe(module: InspectableModule): boolean;
