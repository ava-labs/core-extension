import { useCallback, useMemo } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { FormattedCollectible } from '../CollectiblesTab';
import { ipfsResolver } from '@avalabs/core-utils-sdk';

/**
 * Type for the image metadata response
 */
interface ImageMetadata {
  image: string;
}

export const ipfsUrl = (url: string): string => {
  try {
    return ipfsResolver(url, 'https://ipfs.io');
  } catch {
    // ipfsResolver will throw an error if url does not contain an IPFS CID
    return url;
  }
};

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
  // Process tokenUri - replace {id} placeholders and convert IPFS URIs to HTTP
  const tokenUri = useMemo(() => {
    const withId = collectible.tokenUri?.includes('{id}')
      ? collectible.tokenUri?.replace('{id}', collectible.tokenId || '')
      : collectible.tokenUri;
    return withId ? ipfsUrl(withId) : '';
  }, [collectible.tokenId, collectible.tokenUri]);

  const unreachableCollectible = useMemo(() => {
    return collectible;
  }, [collectible]);

  const select = useCallback(
    (data: ImageMetadata | null): FormattedCollectible => {
      if (data === null) {
        return unreachableCollectible;
      }

      if (data.image) {
        return {
          ...collectible,
          tokenUri: tokenUri || '',
          logoUri: ipfsUrl(data.image),
        };
      }

      return collectible;
    },
    [collectible, unreachableCollectible, tokenUri],
  );

  const query = useQuery<ImageMetadata | null, Error, FormattedCollectible>({
    queryKey: ['collectible-metadata', tokenUri],
    queryFn: tokenUri ? () => fetcher(tokenUri) : skipToken,
    select,
    retry: false,
    staleTime: Infinity, // NFT metadata doesn't change
  });

  // Return the query with collectible property
  return {
    ...query,
    collectible: query.data ?? collectible,
  };
};
