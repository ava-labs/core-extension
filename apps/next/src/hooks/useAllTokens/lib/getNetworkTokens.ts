import { TokenType } from '@avalabs/vm-module-types';
import {
  ExtensionRequest,
  FungibleTokenBalance,
  NetworkWithCaipId,
  RequestHandlerType,
} from '@core/types';
import { GetTokensListHandler } from '~/services/tokens/handlers/getTokenList';
import { getNativeAssetType } from './getNativeAssetType';
import { getTokenMapper } from './getTokenMapper';

type GetNetworkTokensOptions = {
  request: RequestHandlerType;
  network: NetworkWithCaipId;
};

export async function getNetworkTokens({
  request,
  network,
}: GetNetworkTokensOptions): Promise<FungibleTokenBalance[]> {
  try {
    const result = await request<GetTokensListHandler>({
      method: ExtensionRequest.GET_NETWORK_TOKENS,
      params: [network.chainId, []],
    });
    const mapper = getTokenMapper(network.chainId);

    const nativeToken: FungibleTokenBalance = {
      type: TokenType.NATIVE,
      balance: 0n,
      balanceDisplayValue: '0',
      assetType: getNativeAssetType(network),
      coreChainId: network.chainId,
      name: network.networkToken.name,
      symbol: network.networkToken.symbol,
      decimals: network.networkToken.decimals,
      logoUri: network.networkToken.logoUri,
      coingeckoId: '',
    };
    return [
      nativeToken,
      ...Object.values(result.tokens).map<FungibleTokenBalance>(mapper),
    ];
  } catch {
    return [];
  }
}
