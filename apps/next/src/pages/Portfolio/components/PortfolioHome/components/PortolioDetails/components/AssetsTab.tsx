import { Box, Button, Stack } from '@avalabs/k2-alpine';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TrendingTokenBanner } from '@/pages/TrendingTokens/components/banner/TrendingTokenBanner';
import { getUniqueTokenId } from '@core/types';
import {
  useNetworkContext,
  useBalancesContext,
  useAccountsContext,
  useBalanceTotalInCurrency,
} from '@core/ui';

import { AssetCard } from './AssetCard';
import {
  filterAssetsByNetworks,
  getAvailableNetworksFromAssets,
} from '../utils/assetFiltering';
import { FilterMenu } from './FilterMenu';
import { SortMenu } from './SortMenu';
import { AssetSortOption, sortAssets } from '../utils/assetSorting';
import { AssetsEmptyState } from './AssetsEmptyState';
import { AssetsErrorState } from './AssetsErrorState';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';

export const AssetsTab: FC = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { getNetwork } = useNetworkContext();
  const {
    accounts: { active: account },
  } = useAccountsContext();
  const { balances } = useBalancesContext();
  const [sort, setSort] = useState<AssetSortOption | null>(null);
  const [selectedNetworks, setSelectedNetworks] = useState<Set<number>>(
    new Set(),
  );

  const accountBalance = useBalanceTotalInCurrency(account);

  const assets = useTokensForAccount(account);
  const hasError = !!balances.error;

  const availableNetworks = useMemo(
    () => getAvailableNetworksFromAssets(assets, getNetwork),
    [assets, getNetwork],
  );

  const filteredAssets = useMemo(
    () => filterAssetsByNetworks(assets, selectedNetworks),
    [assets, selectedNetworks],
  );

  const sortedAssets = useMemo(
    () => sortAssets(filteredAssets, sort),
    [filteredAssets, sort],
  );

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
        ) : sortedAssets.length === 0 || accountBalance?.sum === 0 ? (
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
