import { FeatureGates } from '@avalabs/posthog-sdk';
import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { FeatureFlagEvents } from '../models';

export function featureFlagsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Record<FeatureGates, boolean>>
) {
  return evt.name === FeatureFlagEvents.FEATURE_FLAG_UPDATED;
}
