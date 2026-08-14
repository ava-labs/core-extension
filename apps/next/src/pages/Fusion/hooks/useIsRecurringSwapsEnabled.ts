import { FeatureGates } from '@core/types';
import { useFeatureFlagContext } from '@core/ui';

export const useIsRecurringSwapsEnabled = () => {
  const { isFlagEnabled } = useFeatureFlagContext();

  return isFlagEnabled(FeatureGates.FUSION_RECURRING_SWAPS);
};
