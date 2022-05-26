import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { Asset, Blockchain, fetchTokenBalances } from '@avalabs/bridge-sdk';
import { NetworkService } from '../../network/NetworkService';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { injectable } from 'tsyringe';

@injectable()
export class BridgeGetEthereumBalanceHandler
  implements ExtensionRequestHandler
{
  methods = [ExtensionRequest.BRIDGE_GET_ETH_BALANCE];

  constructor(private networkService: NetworkService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [asset, account, deprecated] = (request.params || []) as [
      asset: Asset,
      account: string,
      deprecated: boolean
    ];
    const provider = await this.networkService.getEthereumProvider();

    const ethereumBalancesBySymbol = await fetchTokenBalances(
      { [asset.symbol]: asset },
      Blockchain.ETHEREUM,
      provider,
      account,
      deprecated
    );

    const balance: Big = ethereumBalancesBySymbol?.[asset.symbol];

    return {
      ...request,
      result: balance,
    };
  };
}
