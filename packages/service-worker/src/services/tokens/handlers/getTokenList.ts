import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../TokenManagerService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GET_NETWORK_TOKENS,
  { tokens: { [address: string]: NetworkContractToken } },
  [number, string[]]
>;

@injectable()
export class GetTokensListHandler implements HandlerType {
  method = ExtensionRequest.GET_NETWORK_TOKENS as const;

  constructor(private tokenManagerService: TokenManagerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [chainId, disallowedAssets] = request.params;

    const [tokens, err] = await resolve<NetworkContractToken[]>(
      this.tokenManagerService.getTokensByChainId(chainId),
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: {
        tokens: tokens.reduce((allTokens, token) => {
          if (disallowedAssets.includes(token.symbol)) {
            return allTokens;
          }
          allTokens[token.address] = token;
          return allTokens;
        }, {}),
      },
    };
  };
}
