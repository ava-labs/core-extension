import { DAppProviderRequest, DAppRequestHandler } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';
import { SettingsService } from '~/services/settings/SettingsService';
interface WalletGetNetworkStateResponse {
  networks: {
    caip2ChainId: string;
    rpcUrl: string;
    name: string;
    logoUrl?: string;
    explorerUrl?: string;
    networkToken: {
      name: string;
      symbol: string;
      decimals: number;
    };
    enabledTokens: string[];
    disabledTokens: string[];
  }[];
}

@injectable()
export class WalletGetNetworkStateHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_GET_NETWORK_STATE];

  constructor(
    private networkService: NetworkService,
    private settingsService: SettingsService,
  ) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const favoriteNetworks = await this.networkService.getFavoriteNetworks();
    const allNetworks = Object.values(
      await this.networkService.allNetworks.promisify(),
    );
    const activeNetwork = this.networkService.uiActiveNetwork;

    if (!activeNetwork || !allNetworks || !favoriteNetworks) {
      return {
        ...request,
        error: ethErrors.rpc.resourceUnavailable({
          message: 'no active network',
        }),
      };
    }

    const tokenVisibility = await this.settingsService.getTokensVisibility();

    const networks: WalletGetNetworkStateResponse['networks'] = Array.from(
      new Set([activeNetwork.chainId, ...favoriteNetworks]),
    )
      .map((chainId) =>
        allNetworks.find((network) => network.chainId === chainId),
      )
      .filter((network) => network !== undefined)
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

    return {
      ...request,
      result: {
        networks,
      },
    };
  };

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      error: ethErrors.rpc.invalidRequest({
        message: 'account not connected',
      }),
    };
  };
}
