import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { Assets, Blockchain, fetchTokenBalances } from '@avalabs/bridge-sdk';
import { NetworkService } from '../../network/NetworkService';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { injectable } from 'tsyringe';

@injectable()
export class BridgeGetEthereumBalancesHandler
  implements ExtensionRequestHandler
{
  methods = [ExtensionRequest.BRIDGE_GET_ETH_BALANCES];

  constructor(private networkService: NetworkService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [assets, account, deprecated] = (request.params || []) as [
      assets: Assets,
      account: string,
      deprecated: boolean
    ];
    const provider = await this.networkService.getEthereumProvider();
    const ethereumBalancesBySymbol = await fetchTokenBalances(
      assets,
      Blockchain.ETHEREUM,
      provider,
      account,
      deprecated
    );

    const balances: Record<string, Big> = {};

    for (const symbol in assets) {
      balances[symbol] = ethereumBalancesBySymbol?.[symbol];
    }

    return {
      ...request,
      result: balances,
    };
  };
}
