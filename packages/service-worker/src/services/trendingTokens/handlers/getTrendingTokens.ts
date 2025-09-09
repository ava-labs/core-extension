import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { TrendingTokenService } from '../TrendingTokensService';
import { TrendingToken } from '@core/types';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GET_TRENDING_TOKENS,
  { tokens: TrendingToken[] }
>;

@injectable()
export class GetTrendingTokensHandler implements HandlerType {
  method = ExtensionRequest.GET_TRENDING_TOKENS as const;

  constructor(private trendingTokenService: TrendingTokenService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [tokens, err] = await resolve<TrendingToken[]>(
      this.trendingTokenService.getTrendingTokens(),
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
        tokens: tokens,
      },
    };
  };
}
