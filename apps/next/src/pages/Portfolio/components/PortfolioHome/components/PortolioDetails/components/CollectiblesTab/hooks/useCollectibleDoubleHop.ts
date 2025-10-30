import { NftTokenMetadataStatus, formatCollectibleDetails, ipfsUrl } from '@core/glacier-service';
import { skipToken, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import type { EvmCollectible } from '~/balances/evm/types/evmBalanceTypes';

/**
 * Type for the image metadata response
 */
interface ImageMetadata {
  image: string;
}

/**
 * Fetch data from a URL
 */
const fetcher = async (url: string): Promise<ImageMetadata | undefined> => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export const useCollectibleDoubleHop = (collectible: EvmCollectible) => {
  // Process tokenUri - replace {id} placeholders and convert IPFS URIs to HTTP
  const tokenUri = useMemo(() => {
    const withId = collectible.tokenUri?.includes('{id}')
      ? collectible.tokenUri?.replace('{id}', collectible.tokenId || '')
      : collectible.tokenUri;
    return withId ? ipfsUrl(withId) : '';
  }, [collectible.tokenId, collectible.tokenUri]);

  const unreachableCollectible = useMemo(() => {
    return {
      ...collectible,
      metadata: {
        ...collectible.metadata,
        indexStatus: NftTokenMetadataStatus.UNREACHABLE_TOKEN_URI,
      },
    };
  }, [collectible]);

  const select = useCallback(
    (data: ImageMetadata | undefined) => {
      if (data === undefined) {
        return unreachableCollectible;
      }

      if (data.image) {
        const updated = {
          ...collectible,
          tokenUri,
          metadata: {
            ...collectible.metadata,
            indexStatus:
              collectible.metadata.indexStatus !== NftTokenMetadataStatus.INDEXED
                ? NftTokenMetadataStatus.UNINDEXED
                : collectible.metadata.indexStatus,
            imageUri: ipfsUrl(data.image),
          },
        };

        return {
          ...updated,
          ...formatCollectibleDetails(updated),
        };
      }
      return collectible;
    },
    [collectible, unreachableCollectible, tokenUri],
  );

  const query = useQuery<ImageMetadata | undefined, Error, EvmCollectible>({
    queryKey: ['collectible-metadata', tokenUri], //Some collectibles don't have a tokenUri
    queryFn: collectible.tokenUri && !!tokenUri ? () => fetcher(tokenUri) : skipToken,
    select,
    retry: false,
  });

  // Return the query with collectible property
  return {
    ...query,
    collectible: query.data ?? collectible,
  };
};
