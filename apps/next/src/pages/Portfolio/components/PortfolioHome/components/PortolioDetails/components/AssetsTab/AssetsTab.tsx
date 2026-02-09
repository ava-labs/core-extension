import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { TrendingTokenBanner } from '@/pages/TrendingTokens/components/banner/TrendingTokenBanner';
import { Box, Button, Stack } from '@avalabs/k2-alpine';
import { getUniqueTokenId } from '@core/types';
import {
  promoteNetworks,
  useAccountsContext,
  useBalancesContext,
  useBalanceTotalInCurrency,
  useIsMainnet,
  useNetworkContext,
} from '@core/ui';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  AssetCard,
  AssetsEmptyState,
  AssetsErrorState,
  FilterMenu,
  SortMenu,
} from './components';
import {
  AssetSortOption,
  filterAssetsByNetworks,
  getAvailableNetworksFromAssets,
  sortAssets,
} from './utils';

const selectedNetworkStateInitializer = () => new Set<number>();

export const AssetsTab: FC = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { getNetwork, enabledNetworks } = useNetworkContext();
  const {
    accounts: { active: account },
  } = useAccountsContext();
  const { balances } = useBalancesContext();
  const [sort, setSort] = useState<AssetSortOption | null>(null);
  const [selectedNetworks, setSelectedNetworks] = useState<Set<number>>(
    selectedNetworkStateInitializer,
  );
  const isMainnet = useIsMainnet();

  const accountBalance = useBalanceTotalInCurrency(account);

  const assets = useTokensForAccount(account, { networks: enabledNetworks });

  //Only show assets with balances
  const assetsWithBalances = useMemo(() => {
    if (isMainnet) {
      return assets.filter((asset) => asset.balance > 0);
    }
    // on testnet we don't have balances
    return assets;
  }, [assets, isMainnet]);

  const hasError = !!balances.error;

  const availableNetworks = useMemo(
    () =>
      getAvailableNetworksFromAssets(assetsWithBalances, getNetwork).sort(
        promoteNetworks,
      ),
    [assetsWithBalances, getNetwork],
  );

  const filteredAssets = useMemo(
    () => filterAssetsByNetworks(assetsWithBalances, selectedNetworks),
    [assetsWithBalances, selectedNetworks],
  );

  const sortedAssets = useMemo(
    () => sortAssets(filteredAssets, sort),
    [filteredAssets, sort],
  );

  const shouldDisplayEmptyState = isMainnet
    ? sortedAssets.length === 0 || accountBalance?.sum === 0
    : sortedAssets.length === 0;

  return (
    <Stack direction="column" gap={1.25} height={1}>
      <TrendingTokenBanner />
      <Stack direction="row" gap={1}>
        <FilterMenu
          id="filter-menu"
          selected={selectedNetworks}
          onChange={setSelectedNetworks}
          networks={availableNetworks}
        />
        <SortMenu id="sort-menu" sort={sort} onSortChange={setSort} />
        <Box ml="auto">
          <Button
            variant="contained"
            color="secondary"
            size="xsmall"
            onClick={() => push('/manage-tokens')}
          >
            {t('Manage')}
          </Button>
        </Box>
      </Stack>
      <Stack width="100%" flexGrow={1} gap={1}>
        {hasError ? (
          <AssetsErrorState />
        ) : shouldDisplayEmptyState ? (
          <AssetsEmptyState />
        ) : (
          sortedAssets.map((token) => (
            <AssetCard key={getUniqueTokenId(token)} asset={token} />
          ))
        )}
      </Stack>
    </Stack>
  );
};
