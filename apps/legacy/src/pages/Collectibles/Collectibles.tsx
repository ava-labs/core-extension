import { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GridIcon,
  ListIcon,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Button,
} from '@avalabs/core-k2-components';

import { CollectibleGrid } from './components/CollectibleGrid';
import { CollectibleList } from './components/CollectibleList';
import { CollectibleListEmpty } from './components/CollectibleListEmpty';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';
import { usePageHistory } from '@core/ui';
import { useSettingsContext } from '@core/ui';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { useHistory } from 'react-router-dom';
import { CollectibleSkeleton } from './components/CollectibleSkeleton';
import { InfiniteScroll } from '@/components/common/infiniteScroll/InfiniteScroll';
import { useAnalyticsContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { ListType } from '../Home/components/Portfolio/Portfolio';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';
import { useNfts } from '@core/ui';
import { useBalancesContext } from '@core/ui';
import { useLiveBalance } from '@core/ui';

interface CollectiblesProps {
  listType: ListType;
  setListType: Dispatch<SetStateAction<ListType | undefined>>;
  isHistoryLoading: boolean;
}

const POLLED_BALANCES = [TokenType.ERC721, TokenType.ERC1155];

export function Collectibles({
  listType,
  setListType,
  isHistoryLoading,
}: CollectiblesProps) {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const { balances } = useBalancesContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const { collectibles: nfts } = useNfts(network);
  const history = useHistory();
  const setCollectibleParams = useSetCollectibleParams();
  const { setNavigationHistoryData } = usePageHistory();
  const { isFunctionSupported: isManageCollectiblesSupported } =
    useIsFunctionAvailable(FunctionNames.MANAGE_COLLECTIBLES);
  const { getCollectibleVisibility } = useSettingsContext();
  const visibleNfts = nfts.filter((nft) => {
    return getCollectibleVisibility(nft, network?.caipId);
  });

  const handleClick = (type: ListType) => {
    setListType(type);
    setNavigationHistoryData({ listType: type });
  };

  const toggleManageCollectiblesPage = () => {
    if (history.location.pathname.startsWith('/manage-collectibles')) {
      history.push('/');
      return;
    }
    history.push('/manage-collectibles');
  };

  const handleItemClick = useCallback(
    (nft: NftTokenWithBalance) => {
      setCollectibleParams({
        nft,
        options: { path: '/collectible' },
      });

      capture('CollectibleItemClicked', {
        chainId: network?.chainId,
      });
    },
    [capture, network, setCollectibleParams],
  );

  return (
    <Stack style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 1, mr: 2 }}
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
        {isManageCollectiblesSupported && (
          <Button
            variant="text"
            size="small"
            data-testid="manage-collectibles-button"
            onClick={toggleManageCollectiblesPage}
            sx={{ cursor: 'pointer' }}
          >
            {t('Manage')}
          </Button>
        )}
      </Stack>
      {!balances.loading && !!visibleNfts?.length && (
        <InfiniteScroll
          loadMore={() => {}}
          hasMore={false}
          loading={balances.loading}
          error={balances.error?.toString()}
        >
          {listType === ListType.LIST ? (
            <CollectibleList onClick={handleItemClick} />
          ) : (
            <CollectibleGrid onClick={handleItemClick} />
          )}
        </InfiniteScroll>
      )}
      {!balances.loading && visibleNfts?.length === 0 && (
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
      {balances.loading && <CollectibleSkeleton />}
      {balances.error && (
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
