import {
  ExtensionConnectionEvent,
  FeatureFlagEvents,
  FeatureFlags,
} from '@core/types';

export function isFeatureFlagsUpdatedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<FeatureFlags> {
  return evt.name === FeatureFlagEvents.FEATURE_FLAG_UPDATED;
}
