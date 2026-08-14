import type { MarkrServiceInitializer } from '@avalabs/fusion-sdk';
import { mapApiTokenToAsset } from '@core/common';
import { tokenAggregatorApiClient } from '~/api-clients/clients';
import { getV2Tokens } from '~/api-clients/token-aggregator';

export const fetchMarkrTargetChainAssets: MarkrServiceInitializer['getTargetChainAssets'] =
  async ({ targetChainId, page, limit, search }) => {
    const response = await getV2Tokens({
      client: tokenAggregatorApiClient,
      query: {
        caip2Id: targetChainId,
        page,
        limit,
        ...(search?.type === 'address' ? { address: search.value } : {}),
        ...(search?.type === 'keyword' ? { keyword: search.value } : {}),
      },
    });
    const tokens = response.data?.data?.tokens ?? [];
    const meta = response.data?.metadata;

    const assets = tokens
      .map(mapApiTokenToAsset)
      .filter(
        (asset): asset is NonNullable<typeof asset> => asset !== undefined,
      );

    const currentPage = meta?.currentPage ?? page;
    const totalPages = meta?.totalPages ?? currentPage;
    const hasMore = currentPage < totalPages;

    return {
      assets,
      meta: {
        currentPage,
        hasMore,
        nextPage: hasMore ? currentPage + 1 : undefined,
      },
    };
  };
