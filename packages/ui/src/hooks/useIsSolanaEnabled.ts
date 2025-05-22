import { FeatureGates } from '@core/types';
import { useFeatureFlagContext } from '../contexts';

export const useIsSolanaEnabled = () => {
  const { isFlagEnabled } = useFeatureFlagContext();

  return isFlagEnabled(FeatureGates.SOLANA_SUPPORT);
};
