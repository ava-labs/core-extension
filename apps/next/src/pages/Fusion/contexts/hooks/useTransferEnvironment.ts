import { useNetworkContext, useSettingsContext } from '@core/ui';
import { getEnvironment } from '../../lib/getEnvironment';

export const useTransferEnvironment = () => {
  const { isDeveloperMode } = useNetworkContext();
  const { isBridgeDevEnv } = useSettingsContext();

  return getEnvironment(isDeveloperMode, isBridgeDevEnv);
};
