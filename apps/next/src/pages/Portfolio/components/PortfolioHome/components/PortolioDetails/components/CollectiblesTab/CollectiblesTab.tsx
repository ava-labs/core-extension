import { Box, CircularProgress, Stack } from '@avalabs/k2-alpine';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { useAccountsContext, useNetworkContext, useNfts } from '@core/ui';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CollectibleCard } from './components/CollectibleCard';
import { CollectibleListEmpty } from './components/CollectibleListEmpty';
import { CollectibleToolbar } from './components/CollectibleToolbar';
import { CollectiblesManagePopup } from './components/CollectiblesManagePopup';
import { VirtualizedGrid } from './components/VirtualizedGrid';
import {
  FilterType,
  useCollectiblesToolbar,
} from './hooks/useCollectiblesToolbar';
import {
  getCollectibleMediaType,
  getCoreCollectibleUrl,
  getStaticMimeType,
  getUniqueCollectibleId,
} from './utils';

export type FormattedCollectible = NftTokenWithBalance & {
  collectibleTypeMedia: FilterType;
  uniqueCollectibleId: string;
  staticMimeType?: string;
  unreachable?: boolean;
  coreCollectibleUrl?: string;
};

export function CollectiblesTab() {
  const { collectibles, loading } = useNfts();
  const { t } = useTranslation();
  const { isDeveloperMode } = useNetworkContext();
  const { getNetwork } = useNetworkContext();

  const {
    accounts: { active },
  } = useAccountsContext();
  const formattedCollectibles = useMemo(() => {
    return collectibles.map((collectible) => {
      const ownerAddress = active?.addressC;
      const network = getNetwork(collectible.chainId);
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
        coreCollectibleUrl:
          ownerAddress && network
            ? getCoreCollectibleUrl(
                ownerAddress,
                collectible,
                isDeveloperMode,
                network,
              )
            : undefined,
      };
    });
  }, [collectibles, active, getNetwork, isDeveloperMode]);

  const [failedCollectibleIds, setFailedCollectibleIds] = useState<Set<string>>(
    new Set(),
  );

  const {
    processedCollectibles,
    mediaFilters,
    sortOption,
    openManageDialog,
    hideUnreachable,
    hiddenCollectibles,
    hideBrokenImages,
    setHideBrokenImages,
    toggleMediaFilter,
    toggleHideUnreachable,
    toggleCollectible,
    setSortOption,
    setOpenManageDialog,
    networkFilters,
    toggleNetworkFilter,
    clearNetworkFilter,
  } = useCollectiblesToolbar({
    collectibles: formattedCollectibles,
    failedCollectibleIds,
  });

  const handleMediaError = useCallback((id: string) => {
    setFailedCollectibleIds((prev) => {
      if (prev.has(id)) return prev;
      return new Set([...prev, id]);
    });
  }, []);

  const handleMediaLoad = useCallback((id: string) => {
    setFailedCollectibleIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleItemClick = useCallback((nft: FormattedCollectible) => {
    if (nft.coreCollectibleUrl) {
      window.open(nft.coreCollectibleUrl, '_blank', 'noreferrer');
    }
  }, []);

  return (
    <Stack gap={1.25} height={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        {collectibles.length > 0 && (
          <CollectibleToolbar
            mediaFilters={mediaFilters}
            networkFilters={networkFilters}
            toggleNetworkFilter={toggleNetworkFilter}
            toggleMediaFilter={toggleMediaFilter}
            toggleOpenManageDialog={() =>
              setOpenManageDialog(!openManageDialog)
            }
            sortOption={sortOption}
            setSortOption={setSortOption}
            clearNetworkFilter={clearNetworkFilter}
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
            isPopupOpen={openManageDialog}
            items={processedCollectibles}
            cellRenderer={(item, index, virtualizer, columnWidth) => (
              <CollectibleCard
                key={item.uniqueCollectibleId}
                collectible={item}
                onClick={() => handleItemClick(item)}
                onImageDimensions={() => {
                  const el = document.querySelector(`[data-index="${index}"]`);
                  if (el) virtualizer.measureElement(el);
                }}
                minHeight={columnWidth}
                onMediaError={() => handleMediaError(item.uniqueCollectibleId)}
                onMediaLoad={() => handleMediaLoad(item.uniqueCollectibleId)}
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
        hideBrokenImages={hideBrokenImages}
        setHideBrokenImages={setHideBrokenImages}
      />
    </Stack>
  );
}
