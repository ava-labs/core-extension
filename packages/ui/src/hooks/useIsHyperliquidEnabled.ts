import { FeatureGates } from '@core/types';
import { useFeatureFlagContext } from '../contexts';

export const useIsHyperliquidEnabled = () => {
  const { isFlagEnabled } = useFeatureFlagContext();

  return isFlagEnabled(FeatureGates.HYPERLIQUID_FEATURE);
};
