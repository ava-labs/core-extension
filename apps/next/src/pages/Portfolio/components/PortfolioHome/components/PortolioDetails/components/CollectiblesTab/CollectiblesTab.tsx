import { useCallback, useMemo } from 'react';
import { Stack, Box, CircularProgress } from '@avalabs/k2-alpine';
import { CollectibleListEmpty } from './components/CollectibleListEmpty';
import { CollectibleCard } from './components/CollectibleCard';
import { VirtualizedGrid } from './components/VirtualizedGrid';
import { useNfts } from '@core/ui';
import { useLiveBalance } from '@core/ui';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';
import {
  FilterType,
  useCollectiblesToolbar,
} from './hooks/useCollectiblesToolbar';
import {
  getUniqueCollectibleId,
  getStaticMimeType,
  getCollectibleMediaType,
} from './utils';
import { CollectibleToolbar } from './components/CollectibleToolbar';
import { CollectiblesManagePopup } from './components/CollectiblesManagePopup';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

export type FormattedCollectible = NftTokenWithBalance & {
  collectibleTypeMedia: FilterType;
  uniqueCollectibleId: string;
  staticMimeType?: string;
  unreachable?: boolean;
};

const POLLED_BALANCES = [TokenType.ERC721, TokenType.ERC1155];

export function CollectiblesTab() {
  useLiveBalance(POLLED_BALANCES);

  const { collectibles, loading } = useNfts();
  const { t } = useTranslation();
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
    hideUnreachable,
    hiddenCollectibles,
    toggleMediaFilter,
    toggleShowHidden,
    toggleHideUnreachable,
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
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              mt: 5,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : isEmpty(formattedCollectibles) ? (
          <CollectibleListEmpty title={t('No collectibles')} />
        ) : isEmpty(processedCollectibles) ? (
          <CollectibleListEmpty title={t('You hid all your collectibles')} />
        ) : (
          <VirtualizedGrid
            items={processedCollectibles}
            cellRenderer={(item, index, virtualizer) => (
              <CollectibleCard
                key={item.uniqueCollectibleId}
                collectible={item}
                onClick={() => handleItemClick(item)}
                onImageDimensions={() => {
                  const el = document.querySelector(`[data-index="${index}"]`);
                  if (el) virtualizer.measureElement(el);
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
        hideUnreachable={hideUnreachable}
        toggleHideUnreachable={toggleHideUnreachable}
      />
    </Stack>
  );
}
