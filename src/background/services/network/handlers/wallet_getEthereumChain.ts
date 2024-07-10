import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';
import { AddEthereumChainParameter } from '../models';
import { ethErrors } from 'eth-rpc-errors';
import { Network } from '@avalabs/chains-sdk';

export const networkToGetEthChainResponse = (
  network: Network
): AddEthereumChainParameter => ({
  chainId: `0x${network.chainId.toString(16)}`,
  chainName: network.chainName,
  rpcUrls: [network.rpcUrl],
  nativeCurrency: {
    name: network.networkToken.name,
    symbol: network.networkToken.symbol,
    decimals: network.networkToken.decimals,
  },
  blockExplorerUrls: network.explorerUrl ? [network.explorerUrl] : undefined,
  isTestnet: !!network.isTestnet,
});

@injectable()
export class WalletGetEthereumChainHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_GET_CHAIN];

  constructor(private networkService: NetworkService) {
    super();
  }

  handleAuthenticated = async ({ request, scope }) => {
    const activeNetwork = await this.networkService.getNetwork(scope);
    if (!activeNetwork) {
      return {
        ...request,
        error: ethErrors.rpc.resourceUnavailable({
          message: 'no active network',
        }),
      };
    }
    const result: AddEthereumChainParameter =
      networkToGetEthChainResponse(activeNetwork);

    return {
      ...request,
      result,
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: ethErrors.rpc.invalidRequest({
        message: 'account not connected',
      }),
    };
  };
}
