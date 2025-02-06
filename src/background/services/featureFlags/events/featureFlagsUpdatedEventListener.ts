import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { FeatureGates } from '../models';
import { FeatureFlagEvents } from '../models';

export function featureFlagsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Record<FeatureGates, boolean>>,
) {
  return evt.name === FeatureFlagEvents.FEATURE_FLAG_UPDATED;
}
