import { resolveMimeType } from '../utils';
import { skipToken, useQuery } from '@tanstack/react-query';

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

/**
 * Hook to resolve the MIME type of a URL
 * Simply returns the MIME type without any caching or refetch logic
 *
 * @param source The URL to resolve the MIME type for
 * @param staticMimeType Optional static MIME type to use
 * @param tokenId The token ID to use for the query
 * @returns The MIME type string or undefined
 */
export const useResolvedMediaType = ({
  source,
  staticMimeType,
  tokenId,
}: {
  source?: string;
  staticMimeType?: string;
  tokenId?: string;
}) => {
  // Use React Query to handle the async request
  return useQuery({
    queryKey: ['mime-type', source, tokenId],
    queryFn:
      source && !staticMimeType
        ? async () => await resolveMimeType(source)
        : skipToken,
    staleTime: MILLISECONDS_PER_HOUR, // Cache for 1 hour
    retry: false,
  });
};
