import { useCallback, useMemo } from 'react';
import { Stack, Box } from '@avalabs/k2-alpine';
import { CollectibleListEmpty } from './components/CollectibleListEmpty';
import { CollectibleCard } from './components/CollectibleCard';
import { VirtualizedGrid } from './components/VirtualizedGrid';
import { useNfts } from '@core/ui';
import { useLiveBalance } from '@core/ui';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';
import { useCollectiblesToolbar } from './hooks/useCollectiblesToolbar';
import {
  getUniqueCollectibleId,
  getStaticMimeType,
  getCollectibleMediaType,
} from './utils';
import { CollectibleToolbar } from './components/CollectibleToolbar';
import { CollectiblesManagePopup } from './components/CollectiblesManagePopup';

export type FormattedCollectible = NftTokenWithBalance & {
  collectibleTypeMedia: 'picture' | 'gif' | 'video';
  uniqueCollectibleId: string;
  staticMimeType?: string;
};

const POLLED_BALANCES = [TokenType.ERC721, TokenType.ERC1155];

export function CollectiblesTab() {
  useLiveBalance(POLLED_BALANCES);

  const collectibles = useNfts();

  const formattedCollectibles = useMemo(() => {
    return collectibles.map((collectible) => {
      const url = collectible.logoUri ?? undefined;
      const staticMimeType = url ? getStaticMimeType(url) : undefined;
      const mediaType = getCollectibleMediaType(staticMimeType);
      const uniqueCollectibleId = getUniqueCollectibleId(
        collectible.address,
        collectible.tokenId,
        collectible.type,
      );
      return {
        ...collectible,
        collectibleTypeMedia: mediaType,
        uniqueCollectibleId,
        staticMimeType,
      };
    });
  }, [collectibles]);

  const {
    processedCollectibles,
    mediaFilters,
    sortOption,
    openManageDialog,
    showHidden,
    hiddenCollectibles,
    toggleMediaFilter,
    toggleShowHidden,
    toggleCollectible,
    setSortOption,
    setOpenManageDialog,
  } = useCollectiblesToolbar({ collectibles: formattedCollectibles });

  const handleItemClick = useCallback((nft: NftTokenWithBalance) => {
    // TODO: Navigate to collectible details page
    console.log('Clicked collectible:', nft);
    // This would typically use a router to navigate to a detailed view
    // or open a modal with collectible details
  }, []);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, width: '100%' }}
      >
        {collectibles.length > 0 && (
          <CollectibleToolbar
            mediaFilters={mediaFilters}
            toggleMediaFilter={toggleMediaFilter}
            showHidden={showHidden}
            toggleShowHidden={toggleShowHidden}
            toggleOpenManageDialog={() =>
              setOpenManageDialog(!openManageDialog)
            }
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        )}
      </Stack>
      <Box sx={{ width: '100%' }}>
        {processedCollectibles.length === 0 && <CollectibleListEmpty />}

        {processedCollectibles.length > 0 && (
          <VirtualizedGrid
            items={processedCollectibles}
            cellRenderer={(item) => (
              <CollectibleCard
                key={item.uniqueCollectibleId}
                collectible={item}
                onClick={() => handleItemClick(item)}
                onLoad={() => {
                  // Re-measure after image loads
                  // requestAnimationFrame(() => {
                  //   const el = document.querySelector(
                  //     `[data-index="${index}"]`,
                  //   ) as HTMLElement | null;
                  //   if (el) {
                  //     measureElement(el);
                  //   }
                  // });
                }}
              />
            )}
          />
        )}
      </Box>
      <CollectiblesManagePopup
        open={openManageDialog}
        onClose={() => setOpenManageDialog(!openManageDialog)}
        collectibles={formattedCollectibles}
        hiddenCollectibles={hiddenCollectibles}
        toggleCollectible={toggleCollectible}
      />
    </Stack>
  );
}
