import {
  ExtensionConnectionEvent,
  FeatureFlagEvents,
  FeatureGates,
} from '@core/types';

export function featureFlagsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Record<FeatureGates, boolean>>,
) {
  return evt.name === FeatureFlagEvents.FEATURE_FLAG_UPDATED;
}
