import {
  GridIcon,
  ListIcon,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@avalabs/k2-components';

import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useCallback, useEffect, useState } from 'react';
import { CollectibleGrid } from './components/CollectibleGrid';
import { CollectibleList } from './components/CollectibleList';
import { CollectibleListEmpty } from './components/CollectibleListEmpty';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import {
  NftTokenWithBalance,
  TokenType,
} from '@src/background/services/balances/models';
import { useTranslation } from 'react-i18next';
import { CollectibleSkeleton } from './components/CollectibleSkeleton';
import { InfiniteScroll } from '@src/components/common/infiniteScroll/InfiniteScroll';

enum ListType {
  GRID = 'GRID',
  LIST = 'LIST',
}

export function Collectibles() {
  const { t } = useTranslation();
  const { nfts, updateNftBalances } = useBalancesContext();
  const setCollectibleParams = useSetCollectibleParams();
  const { getPageHistoryData, setNavigationHistoryData, isHistoryLoading } =
    usePageHistory();

  const { listType: historyListType }: { listType?: ListType } =
    getPageHistoryData();

  const [listType, setListType] = useState<ListType | undefined>(
    historyListType
  );
  const [loading, setLoading] = useState(false);

  const update = useCallback(() => {
    if (loading || !updateNftBalances) {
      return;
    }

    setLoading(true);
    if (
      nfts.pageTokens &&
      (nfts.pageTokens[TokenType.ERC1155] || nfts.pageTokens[TokenType.ERC721])
    ) {
      updateNftBalances(nfts.pageTokens, () => setLoading(false));
    }
  }, [loading, updateNftBalances, nfts.pageTokens]);

  useEffect(() => {
    if (isHistoryLoading) {
      return;
    }
    if (historyListType) {
      setListType(historyListType);
      return;
    }
    setListType(ListType.GRID);
  }, [historyListType, isHistoryLoading]);

  const handleClick = (listType: ListType) => {
    setListType(listType);
    setNavigationHistoryData({ listType: listType });
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
    >
      <ToggleButtonGroup
        sx={{
          my: 1,
          ml: 2,
        }}
        exclusive
        size="small"
        color="primary"
        disabled={isHistoryLoading && !listType}
        value={listType}
        onChange={(_, value) => handleClick(value)}
      >
        <ToggleButton value={ListType.GRID}>
          <GridIcon size={16} />
        </ToggleButton>
        <ToggleButton value={ListType.LIST}>
          <ListIcon size={16} />
        </ToggleButton>
      </ToggleButtonGroup>
      {!nfts.loading && !!nfts.items?.length && (
        <InfiniteScroll
          loadMore={update}
          hasMore={
            !!nfts.pageTokens?.[TokenType.ERC721] ||
            !!nfts.pageTokens?.[TokenType.ERC1155]
          }
          loading={loading}
          error={nfts.error?.toString()}
        >
          {listType === ListType.LIST ? (
            <CollectibleList
              onClick={(nft: NftTokenWithBalance) =>
                setCollectibleParams({
                  nft,
                  options: { path: '/collectible' },
                })
              }
            />
          ) : (
            <CollectibleGrid
              onClick={(nft: NftTokenWithBalance) =>
                setCollectibleParams({
                  nft,
                  options: { path: '/collectible' },
                })
              }
            />
          )}
        </InfiniteScroll>
      )}
      {!nfts.loading && nfts.items?.length === 0 && (
        <Stack
          sx={{
            flexGrow: 1,
            pb: 9,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CollectibleListEmpty />
        </Stack>
      )}
      {nfts.loading && (
        <Scrollbars>
          <CollectibleSkeleton />
        </Scrollbars>
      )}
      {nfts.error && (
        <Stack
          sx={{
            flexGrow: 1,
            pb: 9,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
              height: '22px',
              fontWeight: 'fontWeightSemibold',
            }}
          >
            {t('Error')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              align: 'center',
              height: '17px',
              my: 1,
            }}
          >
            {t('Failed to load collectibles')}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
