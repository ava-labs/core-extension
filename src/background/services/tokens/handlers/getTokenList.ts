import { NetworkContractToken } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../TokenManagerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GET_NETWORK_TOKENS,
  { tokens: { [address: string]: NetworkContractToken } },
  [number]
>;

@injectable()
export class GetTokensListHandler implements HandlerType {
  method = ExtensionRequest.GET_NETWORK_TOKENS as const;

  constructor(private tokenManagerService: TokenManagerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [chainId] = request.params;

    const [tokens, err] = await resolve<NetworkContractToken[]>(
      this.tokenManagerService.getTokensByChainId(chainId)
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
          allTokens[token.address] = token;
          return allTokens;
        }, {}),
      },
    };
  };
}
