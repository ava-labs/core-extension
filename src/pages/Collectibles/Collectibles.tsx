import {
  GridIcon,
  HorizontalFlex,
  ListIcon,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';

import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
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

const ButtonGroup = styled(HorizontalFlex)`
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
  margin: 8px 0 8px 16px;
`;

const GroupButton = styled(PrimaryButton)<{ active: boolean }>`
  border-radius: 0;
  width: 32px;
  height: 24px;
  min-height: 24px;
  border: none;

  &:focus {
    border: none;
  }

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.buttons.primary.bgHover : `${theme.palette.grey[100]}4D`};
  }

  ${({ active, theme }) =>
    `background-color: ${
      active ? theme.buttons.primary.bg : `${theme.palette.grey[100]}33`
    }
    };`}
`;

export function Collectibles() {
  const { t } = useTranslation();
  const theme = useTheme();
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
  if (isHistoryLoading && !listType) {
    return (
      <VerticalFlex grow="1">
        <ButtonGroup>
          <GroupButton active={true}>
            <GridIcon height="14px" color={theme.colors.icon2} />
          </GroupButton>
          <GroupButton active={false}>
            <ListIcon height="16px" color={theme.colors.icon2} />
          </GroupButton>
        </ButtonGroup>
        <Scrollbars>
          <CollectibleSkeleton />
        </Scrollbars>
      </VerticalFlex>
    );
  }

  return (
    <VerticalFlex grow="1">
      <ButtonGroup>
        <GroupButton
          active={listType === ListType.GRID}
          onClick={() => {
            handleClick(ListType.GRID);
          }}
          data-testid="grid-view"
        >
          <GridIcon
            height="14px"
            color={
              listType === ListType.GRID ? theme.colors.bg1 : theme.colors.icon2
            }
          />
        </GroupButton>
        <GroupButton
          active={listType === ListType.LIST}
          onClick={() => {
            handleClick(ListType.LIST);
          }}
          data-testid="list-view"
        >
          <ListIcon
            height="16px"
            color={
              listType === ListType.LIST ? theme.colors.bg1 : theme.colors.icon2
            }
          />
        </GroupButton>
      </ButtonGroup>
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
        <VerticalFlex
          grow="1"
          padding="0 0 72px"
          width="100%"
          align="center"
          justify="center"
        >
          <CollectibleListEmpty />
        </VerticalFlex>
      )}
      {nfts.loading && (
        <Scrollbars>
          <CollectibleSkeleton />
        </Scrollbars>
      )}
      {nfts.error && (
        <VerticalFlex
          grow="1"
          padding="0 0 72px"
          width="100%"
          align="center"
          justify="center"
        >
          <Typography size={18} height="22px" weight={600}>
            {t('Error')}
          </Typography>
          <Typography size={14} align="center" height="17px" margin="8px 0">
            {t('Failed to load collectibles')}
          </Typography>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
}
