import { caipToChainId } from '@core/common';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../TokenManagerService';
import type { SearchedToken } from './searchNetworkTokens';

type Params = [caip2Id: string, addresses: string[]];

type Result = { tokens: SearchedToken[]; failedAddresses: string[] };

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LOOKUP_NETWORK_TOKENS,
  Result,
  Params
>;

@injectable()
export class LookupNetworkTokensHandler implements HandlerType {
  method = ExtensionRequest.LOOKUP_NETWORK_TOKENS as const;

  constructor(private tokenManagerService: TokenManagerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [caip2Id, addresses] = request.params;

    if (addresses.length === 0) {
      return { ...request, result: { tokens: [], failedAddresses: [] } };
    }

    try {
      const chainId = caipToChainId(caip2Id);
      const { tokens, failedAddresses } =
        await this.tokenManagerService.lookupTokens(caip2Id, addresses);

      return {
        ...request,
        result: {
          tokens: tokens.map((token) => ({
            address: token.address,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            logoUri: token.logoUri,
            isVerified: token.isVerified,
            contractType: token.contractType as SearchedToken['contractType'],
            chainId,
            caip2Id,
          })),
          failedAddresses,
        },
      };
    } catch (err) {
      return { ...request, error: String(err) };
    }
  };
}
