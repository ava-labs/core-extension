import { NetworkService } from '../NetworkService';
import { SettingsService } from '~/services/settings/SettingsService';

export const getNetworkStateWithTokenvisibility = async (
  networkService: NetworkService,
  settingsService: SettingsService,
) => {
  const enabledNetworks = await networkService.getEnabledNetworks(); // Enabled networks include the favorited networks from legacy
  const allNetworks = Object.values(
    await networkService.allNetworks.promisify(),
  );
  const activeNetwork = networkService.uiActiveNetwork;

  if (!activeNetwork || !allNetworks) {
    throw new Error('no active network');
  }

  const tokenVisibility = await settingsService.getTokensVisibility();

  return Array.from(new Set([activeNetwork.chainId, ...enabledNetworks]))
    .map((chainId) =>
      allNetworks.find((network) => network.chainId === chainId),
    )
    .filter((network) => network !== undefined)
    .filter((network) => network.isTestnet === activeNetwork.isTestnet)
    .map((network) => {
      return {
        caip2ChainId: network.caipId,
        rpcUrl: network.rpcUrl,
        name: network.chainName,
        logoUrl: network.logoUri,
        explorerUrl: network.explorerUrl,
        networkToken: {
          name: network.networkToken.name,
          symbol: network.networkToken.symbol,
          decimals: network.networkToken.decimals,
        },
        enabledTokens: Object.keys(
          tokenVisibility[network.caipId] ?? {},
        ).filter((token) => tokenVisibility[network.caipId]?.[token]),
        disabledTokens: Object.keys(
          tokenVisibility[network.caipId] ?? {},
        ).filter((token) => !tokenVisibility[network.caipId]?.[token]),
      };
    });
};
