import { resolveMimeType } from '../utils';

/**
 * Hook to resolve the MIME type of a URL
 * Simply returns the MIME type without any caching or refetch logic
 *
 * @param source The URL to resolve the MIME type for
 * @param staticMimeType Optional static MIME type to use
 * @returns The MIME type string or undefined
 */
export const useResolvedMediaType = ({ source }: { source?: string }) => {
  // Otherwise, resolve from the source
  if (source) {
    return resolveMimeType(source);
  }

  return undefined;
};
