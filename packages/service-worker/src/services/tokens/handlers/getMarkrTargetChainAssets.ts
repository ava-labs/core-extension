import type { AssetWithExtras, Caip2ChainId } from '@avalabs/fusion-sdk';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { fetchMarkrTargetChainAssets } from '../../transferTracking/fetchMarkrTargetChainAssets';

// search is split into two scalars to avoid the {type, value} object shape
// colliding with the messaging layer's serialization type-tag check.
type Params = [
  targetChainId: Caip2ChainId,
  page: number,
  limit: number,
  searchType?: 'address' | 'keyword',
  searchValue?: string,
];

type Result = {
  readonly assets: readonly AssetWithExtras[];
  readonly meta: {
    readonly currentPage: number;
    readonly hasMore: boolean;
    readonly nextPage: number | undefined;
  };
};

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GET_MARKR_TARGET_CHAIN_ASSETS,
  Result,
  Params
>;

@injectable()
export class GetMarkrTargetChainAssetsHandler implements HandlerType {
  method = ExtensionRequest.GET_MARKR_TARGET_CHAIN_ASSETS as const;

  handle: HandlerType['handle'] = async ({ request }) => {
    const [targetChainId, page, limit, searchType, searchValue] =
      request.params;
    const search =
      searchType && searchValue
        ? { type: searchType, value: searchValue }
        : undefined;

    try {
      const result = await fetchMarkrTargetChainAssets({
        targetChainId,
        page,
        limit,
        search,
      });
      return { ...request, result };
    } catch (err) {
      return { ...request, error: String(err) };
    }
  };
}
