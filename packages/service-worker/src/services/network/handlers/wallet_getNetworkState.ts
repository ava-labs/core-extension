import { DAppProviderRequest, DAppRequestHandler } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';
import { SettingsService } from '~/services/settings/SettingsService';
import { getNetworkStateWithTokenvisibility } from '../utils/getNetworkStateWithTokenvisibility';
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
    try {
      const networks: WalletGetNetworkStateResponse['networks'] =
        await getNetworkStateWithTokenvisibility(
          this.networkService,
          this.settingsService,
        );

      return {
        ...request,
        result: {
          networks,
        },
      };
    } catch (error) {
      return {
        ...request,
        error: ethErrors.rpc.resourceUnavailable({
          message: (error as Error)?.message ?? 'unknown error',
        }),
      };
    }
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
