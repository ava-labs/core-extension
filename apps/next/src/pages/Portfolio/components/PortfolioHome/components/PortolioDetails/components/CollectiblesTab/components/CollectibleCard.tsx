import { memo, useCallback } from 'react';
import { Box, Typography } from '@avalabs/k2-alpine';
import { FormattedCollectible } from '../CollectiblesTab';
import { MediaRenderer } from './MediaRenderer';
import { useCollectibleDisplay } from '../hooks/useCollectibleDisplay';

export const CollectibleCard = memo(function CollectibleCard({
  collectible,
  onClick,
  onImageDimensions,
  showTokenId = true,
  minHeight,
  onMediaError,
  onMediaLoad,
}: {
  collectible: FormattedCollectible;
  onClick: () => void;
  onImageDimensions: () => void;
  showTokenId?: boolean;
  minHeight?: number;
  onMediaError?: (id: string) => void;
  onMediaLoad?: (id: string) => void;
}) {
  const { enhancedCollectible, showError, refetch, isLoading } =
    useCollectibleDisplay(collectible);

  const handleLoad = useCallback(() => {
    onImageDimensions();
    onMediaLoad?.(collectible.uniqueCollectibleId);
  }, [onImageDimensions, onMediaLoad, collectible.uniqueCollectibleId]);

  const handleError = useCallback(() => {
    onMediaError?.(collectible.uniqueCollectibleId);
  }, [onMediaError, collectible.uniqueCollectibleId]);

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {showTokenId && (
        <Box
          position="absolute"
          top={5}
          right={5}
          bgcolor={(theme) => theme.palette.grey[700]}
          borderRadius="9999px"
          border={1}
          borderColor="divider"
          zIndex={5}
          maxWidth="calc(100% - 40px)"
          overflow="hidden"
        >
          <Typography
            variant="body2"
            px={1}
            fontWeight={600}
            color="white"
            noWrap
            fontSize={12}
          >
            {`#${collectible.tokenId}`}
          </Typography>
        </Box>
      )}
      <MediaRenderer
        collectible={enhancedCollectible}
        showError={showError}
        isLoading={isLoading}
        onLoad={handleLoad}
        onError={handleError}
        refetch={refetch}
        staticMimeType={collectible.staticMimeType}
        maintainAspectRatio={false}
        minHeight={minHeight}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </Box>
  );
});
