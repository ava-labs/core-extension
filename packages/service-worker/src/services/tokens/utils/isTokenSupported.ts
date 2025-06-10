import { Network } from '@avalabs/core-chains-sdk';
import { SettingsState } from '@core/types';

export async function isTokenSupported(
  tokenAddress: string,
  network: Network,
  settings: SettingsState,
) {
  const tokenExistInNetwork = network.tokens?.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
  );
  return (
    tokenExistInNetwork ||
    settings.customTokens[network.chainId]?.[tokenAddress.toLowerCase()]
  );
}
