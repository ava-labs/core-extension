import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';

export const useIsSolanaEnabled = () => {
  const { isFlagEnabled } = useFeatureFlagContext();

  return isFlagEnabled(FeatureGates.SOLANA_SUPPORT);
};
