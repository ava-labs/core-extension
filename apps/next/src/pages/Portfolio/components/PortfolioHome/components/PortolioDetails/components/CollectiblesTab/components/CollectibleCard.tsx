import { memo } from 'react';
import { Box, Typography } from '@avalabs/k2-alpine';
import { FormattedCollectible } from '../CollectiblesTab';
import { MediaRenderer } from './MediaRenderer';
import { useCollectibleDisplay } from '../hooks/useCollectibleDisplay';

export const CollectibleCard = memo(function CollectibleCard({
  collectible,
  onClick,
  onImageDimensions,
  showTokenId = true,
}: {
  collectible: FormattedCollectible;
  onClick: () => void;
  onImageDimensions: () => void;
  showTokenId?: boolean;
}) {
  const { enhancedCollectible, showError, refetch, isLoading } =
    useCollectibleDisplay(collectible);

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
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
          bgcolor="text.secondary"
          borderRadius="9999px"
          zIndex={5}
          maxWidth="calc(100% - 20px)"
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
        onLoad={onImageDimensions}
        refetch={refetch}
        staticMimeType={collectible.staticMimeType}
        maintainAspectRatio={true}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </Box>
  );
});
