import { MediaTypeFilters, SortMode } from './hooks/useCollectiblesToolbar';
import mime from 'mime/lite';
import { FormattedCollectible } from './CollectiblesTab';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

export const getStaticMimeType = (url: string): string | undefined => {
  return mime.getType(url) ?? undefined;
};

export const BASE64_IMAGE_REGEX =
  /^(data:image\/svg\+xml;base64|data:application\/json;base64),/;

let videoElement: HTMLVideoElement;

export const getCoreCollectibleUrl = (
  ownerAddress: string,
  collectible: NftTokenWithBalance,
  isDeveloperMode: boolean,
  network: NetworkWithCaipId,
): string => {
  return `https://${isDeveloperMode ? 'test.' : ''}core.app/portfolio/${ownerAddress}/collectibles/${network.subnetExplorerUriId}/${collectible.address}/${collectible.tokenId}/`;
};
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
 * Get display name for sorting (name or collectionName fallback)
 */
const getDisplayName = (collectible: FormattedCollectible): string => {
  return collectible.name || collectible.collectionName || '';
};

/**
 * Compare by logoUri presence - items with logoUri come first
 */
const compareByLogoUri = (
  a: FormattedCollectible,
  b: FormattedCollectible,
): number => {
  const aHasLogo = !!a.logoUri;
  const bHasLogo = !!b.logoUri;
  if (aHasLogo && !bHasLogo) return -1;
  if (!aHasLogo && bHasLogo) return 1;
  return 0; // Same group
};

/**
 * Sort collectibles by SortMode
 * Always prioritizes items with logoUri first, then applies the sort mode within each group
 */
export const sortCollectibles = (
  collectibles: FormattedCollectible[],
  sortMode: SortMode,
): FormattedCollectible[] => {
  const sorted = [...collectibles];

  return sorted.sort((a, b) => {
    // First, prioritize items with logoUri
    const logoComparison = compareByLogoUri(a, b);
    if (logoComparison !== 0) return logoComparison;

    // Within the same group, apply the sort mode
    switch (sortMode) {
      case 'name-asc': {
        const aName = getDisplayName(a);
        const bName = getDisplayName(b);
        return aName.localeCompare(bName);
      }

      case 'name-desc': {
        const aName = getDisplayName(a);
        const bName = getDisplayName(b);
        return bName.localeCompare(aName);
      }

      case 'date-added': {
        const dateA = a.updatedAt ?? 0;
        const dateB = b.updatedAt ?? 0;
        return dateB - dateA; // Most recent first
      }

      default:
        return 0;
    }
  });
};
