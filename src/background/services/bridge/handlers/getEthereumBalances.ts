import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { Assets, Blockchain, fetchTokenBalances } from '@avalabs/bridge-sdk';
import { NetworkService } from '../../network/NetworkService';
import { injectable } from 'tsyringe';
import Big from 'big.js';
import { ChainId } from '@avalabs/chains-sdk';

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
    const logosBySymbol =
      (await this.networkService.activeNetworks.promisify())[
        // Just using mainnet because all we need are the logos
        ChainId.AVALANCHE_MAINNET_ID
      ].tokens?.reduce((acc, token) => {
        acc[token.symbol] = token.logoUri;
        return acc;
      }, {}) || [];

    const balances: {
      [symbol: string]: { balance: Big; logoUri?: string } | undefined;
    } = {};

    for (const symbol in assets) {
      balances[symbol] = {
        balance: ethereumBalancesBySymbol?.[symbol],
        logoUri: logosBySymbol[symbol],
      };
    }

    return {
      ...request,
      result: balances,
    };
  };
}
