import { MediaTypeFilters, SortMode } from './hooks/useCollectiblesToolbar';
import mime from 'mime/lite';
import { FormattedCollectible } from './CollectiblesTab';

export const getStaticMimeType = (url: string): string | undefined => {
  return mime.getType(url) ?? undefined;
};

export const isVideo = (url?: string): boolean => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i.test(url);
};

export const isGif = (url?: string): boolean => {
  if (!url) return false;
  return /\.(gif)(\?.*)?$/i.test(url);
};

export const BASE64_IMAGE_REGEX =
  /^(data:image\/svg\+xml;base64|data:application\/json;base64),/;

let videoElement: HTMLVideoElement;

// Check if browser can play a video type
export const supportsVideoType = (mimeType: string): boolean => {
  if (mimeType && mimeType.startsWith('video/')) {
    if (!videoElement) {
      videoElement = document.createElement('video');
    }
    return !!videoElement.canPlayType(mimeType);
  }
  return false;
};

export const getUniqueCollectibleId = (
  address: string,
  tokenId: string,
  type: string,
) => {
  return `${address}:${tokenId}:${type}`;
};

// We must return `null` in the empty case to satisfy usage in queryFn's.
export const resolveMimeType = async (url: string): Promise<string | null> => {
  if (!url) {
    return null;
  }

  try {
    const res = await fetch(url, {
      method: 'HEAD',
    });

    if (res.ok && res.headers.has('content-type')) {
      return res.headers.get('content-type');
    }

    return null;
  } catch {
    return null;
  }
};

// Determine if we should render a video tag
export const shouldRenderVideoTag = (mimeType: string): boolean =>
  supportsVideoType(mimeType);
// Get media rendering type - expanded functionality for MediaRenderer
export const getMediaRenderType = (
  mimeType?: string,
): 'image' | 'video' | 'iframe' | 'unknown' => {
  if (!mimeType) {
    return 'unknown';
  }

  if (mimeType.startsWith('text/html')) {
    return 'iframe';
  }

  if (shouldRenderVideoTag(mimeType)) {
    return 'video';
  }

  if (mimeType.startsWith('image/')) {
    return 'image';
  }

  return 'unknown';
};

/**
 * Get collectible media type for filtering purposes
 */
export const getCollectibleMediaType = (
  mimeType?: string,
): 'picture' | 'gif' | 'video' => {
  if (mimeType === 'image/gif') {
    return 'gif';
  }
  if (mimeType?.startsWith('video/')) {
    return 'video';
  }
  return 'picture';
};

/**
 * Filter collectibles by media type
 */
export const filterCollectiblesByMediaType = (
  collectibles: FormattedCollectible[],
  mediaFilters: MediaTypeFilters,
): FormattedCollectible[] => {
  if (mediaFilters.all) {
    return collectibles;
  }
  return collectibles.filter((collectible) => {
    const type = collectible.collectibleTypeMedia;
    return mediaFilters[type];
  });
};

/**
 * Sort collectibles by SortMode
 */
export const sortCollectibles = (
  collectibles: FormattedCollectible[],
  sortMode: SortMode,
): FormattedCollectible[] => {
  const sorted = [...collectibles];

  switch (sortMode) {
    case 'name-asc':
      return sorted.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    case 'name-desc':
      return sorted.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });

    case 'date-added':
      return sorted.sort((a, b) => {
        const dateA = a.updatedAt ?? 0;
        const dateB = b.updatedAt ?? 0;
        // Most recent first (descending)
        return dateB - dateA;
      });

    default:
      return sorted;
  }
};
