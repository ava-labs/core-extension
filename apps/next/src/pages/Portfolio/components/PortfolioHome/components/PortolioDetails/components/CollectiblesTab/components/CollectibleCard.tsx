import { memo } from 'react';
import { Box } from '@avalabs/k2-alpine';
import { FormattedCollectible } from '../CollectiblesTab';
import { MediaRenderer } from './MediaRenderer';
import { useCollectibleDisplay } from '../hooks/useCollectibleDisplay';

export const CollectibleCard = memo(function CollectibleCard({
  collectible,
  onClick,
  onLoad,
}: {
  collectible: FormattedCollectible;
  onClick: () => void;
  onLoad: () => void;
}) {
  const { enhancedCollectible, isLoading, showError } =
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MediaRenderer
        collectible={enhancedCollectible}
        showError={showError}
        isLoading={isLoading}
        staticMimeType={collectible.staticMimeType}
        onLoad={onLoad}
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
