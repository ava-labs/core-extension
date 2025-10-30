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
