import { useBridgeEnvironment } from '@/hooks/useBridgeEnvironment';
import { useNetworkContext } from '@core/ui';
import { getEnvironment } from '../../lib/getEnvironment';

export const useTransferEnvironment = () => {
  const { isDeveloperMode } = useNetworkContext();
  const { isBridgeDevEnv } = useBridgeEnvironment(isDeveloperMode);

  return getEnvironment(isDeveloperMode, isBridgeDevEnv);
};
