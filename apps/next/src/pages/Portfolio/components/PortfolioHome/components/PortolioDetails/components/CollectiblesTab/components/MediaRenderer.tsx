import { Box, Button, RefreshIcon, Skeleton, Stack } from '@avalabs/k2-alpine';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { BASE64_IMAGE_REGEX, isVideo } from '../utils';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';

type SharedMediaProps = {
  onError?: () => void;
  onLoad?: () => void;
  showError?: boolean;
  style?: CSSProperties;
};

type MediaRendererProps = SharedMediaProps & {
  collectible?: NftTokenWithBalance;
};

// Media components
const MediaSkeleton = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        minHeight: '120px',
      }}
    >
      <Skeleton variant="rounded" width={92} height={120} />
    </Box>
  );
};

const VideoPlayer = ({ src, style, onLoad, onError, ...restProps }) => {
  return (
    <video
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
        minHeight: '120px',
        ...style,
      }}
      {...restProps}
    />
  );
};

export const MediaRenderer = ({
  collectible,
  style,
  ...restProps
}: MediaRendererProps) => {
  // Tracks whether to use fallback source (srcRaw) when primary source fails
  const [useFallback, setUseFallback] = useState(false);
  // Tracks if media element has loaded in DOM
  const [isLoaded, setIsLoadedd] = useState(false);
  const [isError, setIsError] = useState(false);

  const onError = () => {
    if (useFallback) {
      setIsError(true);
    } else {
      setUseFallback(true);
    }
  };

  const setIsLoaded = (loaded: boolean) => {
    console.log('setIsLoaded', loaded, collectible);
    setIsLoadedd(loaded);
  };

  const currentSource = useFallback
    ? collectible?.logoSmall
    : collectible?.logoUri;

  const mergedStyle: CSSProperties = {
    width: '100%',
    borderRadius: '4px',
    objectFit: 'contain',
    ...style,
  };

  console.log(collectible);
  // Error state UI
  if (isError) {
    return (
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
        }}
        {...restProps}
      >
        <Button
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
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          <RefreshIcon size={22} />
        </Button>
      </Box>
    );
  }

  // Media container with loading state
  const renderMediaContainer = (children: React.ReactNode) => (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
      }}
    >
      {!isLoaded && <MediaSkeleton />}
      {children}
    </Box>
  );

  // Video content
  if (isVideo(currentSource)) {
    return renderMediaContainer(
      <VideoPlayer
        style={mergedStyle}
        src={currentSource}
        onError={() => onError()}
        onLoad={() => setIsLoaded(true)}
        {...restProps}
      />,
    );
  }

  // Default case: render an image
  return (
    <Box
      component="picture"
      sx={{
        width: '100%',
        position: 'relative',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {!isLoaded && (
        <Stack>
          <MediaSkeleton />
        </Stack>
      )}

      <img
        src={currentSource}
        style={{
          width: '100%',
          objectFit: 'contain',
          backgroundColor: 'transparent',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
          zIndex: 1,
        }}
        onError={() => onError()}
        onLoad={() => setIsLoaded(true)}
        decoding="async"
        loading="lazy"
        {...restProps}
        alt={collectible?.name}
      />
    </Box>
  );
};
