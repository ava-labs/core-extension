import { caipToChainId } from '@core/common';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../TokenManagerService';

export type SearchedToken = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUri?: string;
  isVerified?: boolean | null;
  contractType: 'ERC-20' | 'SPL';
  chainId: number;
  caip2Id: string;
};

type Params = [
  caip2Ids: string[],
  page: number,
  limit: number,
  keyword?: string,
  includeMalicious?: boolean,
  address?: string,
];

type Result = {
  tokens: SearchedToken[];
  currentPage: number;
  hasMore: boolean;
  nextPage?: number;
};

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEARCH_NETWORK_TOKENS,
  Result,
  Params
>;

@injectable()
export class SearchNetworkTokensHandler implements HandlerType {
  method = ExtensionRequest.SEARCH_NETWORK_TOKENS as const;

  constructor(private tokenManagerService: TokenManagerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [caip2Ids, page, limit, keyword, includeMalicious, address] =
      request.params;

    try {
      const { tokens, currentPage, totalPages } =
        await this.tokenManagerService.searchTokens({
          caip2Ids,
          page,
          limit,
          keyword: keyword || undefined,
          address: address || undefined,
          includeMalicious,
        });

      const mapped = tokens.flatMap<SearchedToken>((token) => {
        let chainId: number;
        try {
          chainId = caipToChainId(token.caip2Id);
        } catch {
          return [];
        }

        return [
          {
            address: token.address,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            logoUri: token.logoUri,
            isVerified: token.isVerified,
            contractType: token.contractType,
            chainId,
            caip2Id: token.caip2Id,
          },
        ];
      });

      const hasMore = currentPage < totalPages;

      return {
        ...request,
        result: {
          tokens: mapped,
          currentPage,
          hasMore,
          nextPage: hasMore ? currentPage + 1 : undefined,
        },
      };
    } catch (err) {
      return { ...request, error: String(err) };
    }
  };
}
