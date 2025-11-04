import { Box, Button, RefreshIcon, Skeleton, Stack } from '@avalabs/k2-alpine';
import type { CSSProperties, LegacyRef, PropsWithChildren } from 'react';
import { forwardRef, memo, useRef, useState } from 'react';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { BASE64_IMAGE_REGEX, getMediaRenderType } from '../utils';

// Utility to merge multiple refs
const mergeRefs = <T,>(refs: Array<React.Ref<T> | undefined>) => {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
};

// Utility to sleep for a duration
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type SharedMediaProps = {
  onError?: () => void;
  onLoad?: () => void;
  showError?: boolean;
  style?: CSSProperties;
};

type MediaRendererProps = SharedMediaProps & {
  alt?: string;
  showSkeleton?: boolean;
  isLoading?: boolean;
  refetch?: () => void;
  maintainAspectRatio?: boolean;
  staticMimeType?: string;
  collectible?: NftTokenWithBalance;
};

// Media components
const MediaSkeleton = memo(function MediaSkeleton() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        minHeight: '92px',
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: '100%',
          background: '#3a3a3b',
          borderRadius: '4px',
        }}
      />
    </Box>
  );
});

const VideoPlayer = memo(
  forwardRef<HTMLVideoElement, MediaRendererProps & { src?: string }>(
    function VideoPlayer({ src, style, onLoad, onError }, ref) {
      const videoRef = useRef<HTMLVideoElement>(null);

      return (
        <video
          ref={mergeRefs([videoRef, ref])}
          src={src}
          loop
          autoPlay
          playsInline
          muted
          preload="metadata"
          onLoadedData={onLoad}
          onError={onError}
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: '#3a3a3b',
            minHeight: '92px',
            ...style,
          }}
        />
      );
    },
  ),
);

const IframePlayer = memo(
  forwardRef<HTMLIFrameElement, MediaRendererProps & { src?: string }>(
    function IframePlayer({ src, onError, onLoad, alt, style }, ref) {
      return (
        <iframe
          title={alt}
          src={src}
          ref={ref}
          frameBorder={0}
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: '#3a3a3b',
            minHeight: '92px',
            ...style,
          }}
          onError={onError}
          onLoad={onLoad}
          sandbox="allow-scripts"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      );
    },
  ),
);

export const MediaRenderer = memo(
  forwardRef<HTMLMediaElement, PropsWithChildren<MediaRendererProps>>(
    function MediaRenderer(
      {
        collectible,
        alt,
        isLoading: externalIsLoading = false,
        refetch: externalRefetch,
        showSkeleton = true,
        showError: externalShowError = false,
        maintainAspectRatio = true,
        style,
        staticMimeType,
        onError: onErrorProp,
        onLoad: onLoadProp,
        ...restProps
      },
      ref,
    ) {
      // Tracks whether to use fallback source when primary source fails
      const [useFallback, setUseFallback] = useState(false);
      // Tracks if media element has loaded in DOM
      const [isLoaded, setIsLoaded] = useState(false);
      // Track local refresh state - for button animation
      const [isRefreshingLocally, setIsRefreshingLocally] = useState(false);

      const sourceFirstPass = collectible?.logoUri;
      const srcRaw = collectible?.logoSmall || collectible?.tokenUri;
      const currentSource = useFallback ? srcRaw : sourceFirstPass;

      // Use static MIME type directly (simplified version without async resolution)
      const finalMimeType = staticMimeType;

      const isLoading = externalIsLoading || isRefreshingLocally;

      const mergedStyle: CSSProperties = {
        width: '100%',
        borderRadius: '4px',
        objectFit: maintainAspectRatio ? 'contain' : 'cover',
        ...(isLoaded && !isLoading ? {} : { minHeight: '92px' }),
        ...style,
      };

      const sourceIsBase64Image = srcRaw && BASE64_IMAGE_REGEX.test(srcRaw);

      // Refresh handler
      const handleRefresh = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Show refresh animation
        setIsRefreshingLocally(true);
        await externalRefetch?.();
        await sleep(300);
        setIsRefreshingLocally(false);
        setUseFallback(false);
        setIsLoaded(false);
      };

      const handleError = () => {
        if (useFallback) {
          // Already tried fallback, now it's an error
          onErrorProp?.();
        } else {
          // Try fallback
          setUseFallback(true);
          setIsLoaded(false);
        }
      };

      const handleLoad = () => {
        setIsLoaded(true);
        onLoadProp?.();
      };

      // Determine if in error state - only when not loading and has error
      const isError =
        !isLoading &&
        (externalShowError || (!sourceFirstPass && !srcRaw)) &&
        (!srcRaw || useFallback);

      // Error state UI
      const renderErrorState = () => (
        <Box
          sx={{
            ...mergedStyle,
            backgroundColor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            width: '100%',
            fontSize: '12px',
            minHeight: '92px',
          }}
          {...restProps}
          ref={ref as unknown as LegacyRef<HTMLDivElement>}
        >
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="contained"
            color="secondary"
            sx={{
              padding: 0.5,
              width: 40,
              height: 40,
              minHeight: 40,
              minWidth: 40,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `${isLoading ? 'rotate(360deg)' : ''} translate(-50%, -50%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            <RefreshIcon size={22} />
          </Button>
        </Box>
      );

      // Media container with loading state
      const renderMediaContainer = (children: React.ReactNode) => (
        <Box
          sx={{
            width: '100%',
            ...(isLoaded && !isLoading ? {} : { minHeight: '92px' }),
            position: 'relative',
          }}
        >
          {isLoading && showSkeleton && <MediaSkeleton />}
          {children}
        </Box>
      );

      // Error handling - only show error if not loading
      if (isError && !sourceIsBase64Image) {
        return renderErrorState();
      }

      // Use the getMediaRenderType function to determine what to render
      const renderType = getMediaRenderType(finalMimeType);

      // HTML content
      if (renderType === 'iframe') {
        return renderMediaContainer(
          <IframePlayer
            style={mergedStyle}
            src={currentSource}
            onError={handleError}
            onLoad={handleLoad}
            isLoading={isLoading}
            {...restProps}
          />,
        );
      }

      // Video content
      if (renderType === 'video') {
        return renderMediaContainer(
          <VideoPlayer
            style={mergedStyle}
            src={currentSource}
            onError={handleError}
            onLoad={handleLoad}
            isLoading={isLoading}
            {...restProps}
          />,
        );
      }

      // Default case: render an image
      // Use style.height if provided, otherwise 'auto' for natural aspect ratio
      const containerHeight = style?.height || 'auto';
      const isFixedHeight = containerHeight === '100%';

      return (
        <Box
          component="picture"
          sx={{
            width: '100%',
            position: 'relative',
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'block',
            ...(isFixedHeight
              ? {
                  height: '100%',
                }
              : {}),
            backgroundColor: '#3a3a3b',
            ...(isLoaded && !isLoading && !isFixedHeight
              ? {}
              : { minHeight: '92px' }),
          }}
        >
          {isLoading && showSkeleton && (
            <Stack>
              <MediaSkeleton />
            </Stack>
          )}

          {!isLoading && (
            <source
              srcSet={sourceIsBase64Image ? srcRaw : currentSource}
              type={sourceIsBase64Image ? 'image/svg+xml' : finalMimeType}
            />
          )}
          <img
            src={currentSource}
            style={{
              display: isLoading ? 'none' : 'block',
              width: '100%',
              height: isFixedHeight ? '100%' : 'auto',
              objectFit: maintainAspectRatio ? 'contain' : 'cover',
              backgroundColor: 'transparent',
              opacity: isLoaded && !isLoading ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              zIndex: 1,
            }}
            onError={handleError}
            onLoad={handleLoad}
            ref={ref as unknown as LegacyRef<HTMLImageElement>}
            decoding="async"
            loading="lazy"
            {...restProps}
            alt={alt || collectible?.name}
          />
        </Box>
      );
    },
  ),
);
