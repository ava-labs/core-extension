import { useCallback, useMemo } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { FormattedCollectible } from '../CollectiblesTab';
import { ipfsResolverWithFallback } from '@core/common';
import { NftTokenMetadataStatus } from '@avalabs/glacier-sdk';

/**
 * Type for the image metadata response
 */
interface ImageMetadata {
  image: string;
}

/**
 * Fetch data from a URL
 */
const fetcher = async (url: string): Promise<ImageMetadata | null> => {
  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    return null;
  } catch {
    return null;
  }
};

export const useCollectibleDoubleHop = (collectible: FormattedCollectible) => {
  // Use unique collectible ID for stable query key
  const collectibleId = collectible.uniqueCollectibleId;

  // Process tokenUri - replace {id} placeholders and convert IPFS URIs to HTTP
  const tokenUri = useMemo(() => {
    const withId = collectible.tokenUri?.includes('{id}')
      ? collectible.tokenUri?.replace('{id}', collectible.tokenId || '')
      : collectible.tokenUri;
    return withId ? ipfsResolverWithFallback(withId) : '';
  }, [collectible]);

  const select = useCallback(
    (data: ImageMetadata | null): FormattedCollectible => {
      // If data is null, the URI is unreachable
      if (data === null) {
        return {
          ...collectible,
          metadata: {
            ...collectible.metadata,
            indexStatus: NftTokenMetadataStatus.UNREACHABLE_TOKEN_URI,
          },
        };
      }

      if (data.image) {
        return {
          ...collectible,
          tokenUri: tokenUri || '',
          logoUri: ipfsResolverWithFallback(data.image),
          metadata: {
            ...collectible.metadata,
            indexStatus:
              collectible.metadata?.indexStatus !== 'INDEXED'
                ? NftTokenMetadataStatus.UNINDEXED
                : collectible.metadata?.indexStatus,
          },
        };
      }

      // If no image in metadata, still return unreachable
      return collectible;
    },
    [collectible, tokenUri],
  );

  const query = useQuery<ImageMetadata | null, Error, FormattedCollectible>({
    queryKey: ['collectible-metadata-double-hop', collectibleId, tokenUri],
    queryFn: tokenUri ? () => fetcher(tokenUri) : skipToken,
    select,
    retry: false,
  });

  // Return the query with collectible property and unreachable status
  return {
    ...query,
    collectible: query.data ?? collectible,
  };
};
