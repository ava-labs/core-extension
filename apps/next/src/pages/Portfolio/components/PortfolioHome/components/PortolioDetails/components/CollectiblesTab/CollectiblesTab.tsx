import { useCallback, useMemo } from 'react';
import { Stack, Box } from '@avalabs/k2-alpine';
import debounce from 'lodash.debounce';
import { useHistory, useLocation } from 'react-router-dom';
import { CollectibleListEmpty } from './components/CollectibleListEmpty';
import { CollectibleSkeleton } from './components/CollectibleSkeleton';

import { useNetworkContext, useSettingsContext } from '@core/ui';
import { useBalancesContext } from '@core/ui';
import { useNfts } from '@core/ui';
import { useLiveBalance } from '@core/ui';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';
import { SomethingWentWrong } from '../SomethingWentWrong';
import {
  CollectiblesFilter,
  FilterType,
} from './components/CollectiblesFilter';
import { useTranslation } from 'react-i18next';
import { VirtualisedMasonry } from './components/VirtualisedMasonry';
import { MediaRenderer } from './components/MediaRenderer';

const POLLED_BALANCES = [TokenType.ERC721, TokenType.ERC1155];

const COLLECTIBLES_QUERY_TOKENS = {
  network: 'network',
  type: 'type',
  sort: 'sort',
  showHidden: 'showHidden',
};

type CollectiblesQueryTokens = typeof COLLECTIBLES_QUERY_TOKENS;
type SortMode = 'name-asc' | 'name-desc' | 'date-added';

export function CollectiblesTab() {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const { search } = useLocation();
  const { replace } = useHistory();
  const { balances } = useBalancesContext();
  const { network } = useNetworkContext();
  const nfts = useNfts(network);
  console.log('nfts', nfts);
  const { getCollectibleVisibility } = useSettingsContext();

  // Parse URL search parameters (memoized to prevent unnecessary re-renders)
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const typeFilter =
    (searchParams.get(COLLECTIBLES_QUERY_TOKENS.type) as FilterType) || 'all';
  const sortMode =
    (searchParams.get(COLLECTIBLES_QUERY_TOKENS.sort) as SortMode) ||
    'name-asc';
  const showHidden =
    searchParams.get(COLLECTIBLES_QUERY_TOKENS.showHidden) === 'true';

  // Debounced function to update query parameters
  const updateQueryParam = useMemo(
    () =>
      debounce(
        (
          current: URLSearchParams,
          key: keyof CollectiblesQueryTokens,
          value: string,
        ) => {
          const updated = new URLSearchParams(current);
          if (value === '' || value === 'all' || value === 'false') {
            updated.delete(COLLECTIBLES_QUERY_TOKENS[key]);
          } else {
            updated.set(COLLECTIBLES_QUERY_TOKENS[key], value);
          }

          replace({
            search: updated.toString(),
          });
        },
        250,
      ),
    [replace],
  );

  const visibleNfts = useMemo(() => {
    return nfts
      .filter((nft) => {
        // Apply visibility filter (unless showing hidden)
        if (!showHidden && !getCollectibleVisibility(nft)) {
          return false;
        }

        // Apply type filter
        if (typeFilter !== 'all') {
          const isVideo =
            nft.logoUri &&
            /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i.test(nft.logoUri);
          const isGif = nft.logoUri && /\.gif(\?.*)?$/i.test(nft.logoUri);

          switch (typeFilter) {
            case 'videos':
              if (!isVideo) return false;
              break;
            case 'gifs':
              if (!isGif) return false;
              break;
            case 'pictures':
              if (isVideo || isGif) return false;
              break;
          }
        }

        // Apply network filter (if needed - would require network info in NFT)
        // This would be implemented based on your NFT data structure

        return true;
      })
      .toSorted((a, b) => {
        switch (sortMode) {
          case 'name-asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name-desc':
            return (b.name || '').localeCompare(a.name || '');
          case 'date-added':
          default:
            return 0;
        }
      });
  }, [nfts, typeFilter, sortMode, showHidden, getCollectibleVisibility]);

  const handleItemClick = useCallback((nft: NftTokenWithBalance) => {
    // TODO: Navigate to collectible details page
    console.log('Clicked collectible:', nft);
    // This would typically use a router to navigate to a detailed view
    // or open a modal with collectible details
  }, []);

  const handleTypeChange = useCallback(
    (type: FilterType) => {
      updateQueryParam(searchParams, 'type', type);
    },
    [searchParams, updateQueryParam],
  );

  const handleToggleHidden = useCallback(() => {
    updateQueryParam(searchParams, 'showHidden', showHidden ? 'false' : 'true');
  }, [searchParams, updateQueryParam, showHidden]);

  return (
    <Stack sx={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, px: 2 }}
      >
        {nfts.length > 0 && (
          <CollectiblesFilter
            typeFilter={typeFilter}
            showHidden={showHidden}
            onTypeChange={handleTypeChange}
            onToggleHidden={handleToggleHidden}
          />
        )}
      </Stack>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {balances.loading && <CollectibleSkeleton />}
        {balances.error && (
          <SomethingWentWrong
            title={t('Oops! Something went wrong')}
            description={t('Please hit refresh or try again later')}
            onRefresh={() => {}}
          />
        )}
        {visibleNfts.length === 0 && <CollectibleListEmpty />}

        {visibleNfts.length > 0 && (
          <VirtualisedMasonry
            columnWidth={92}
            itemCount={1}
            cellContentRenderer={(index) => {
              const nft = visibleNfts[index];
              if (!nft) return null;
              return <MediaRenderer key={index} collectible={nft} />;
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
