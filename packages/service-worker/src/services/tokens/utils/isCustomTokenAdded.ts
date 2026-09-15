import { Network } from '@avalabs/core-chains-sdk';
import { SettingsState } from '@core/types';

export function isCustomTokenAdded(
  tokenAddress: string,
  network: Network,
  settings: SettingsState,
): boolean {
  return Boolean(
    settings.customTokens[network.chainId]?.[tokenAddress.toLowerCase()],
  );
}
