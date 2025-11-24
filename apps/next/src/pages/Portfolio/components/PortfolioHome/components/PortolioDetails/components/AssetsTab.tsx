import { Box, Button, ButtonProps, Stack, styled } from '@avalabs/k2-alpine';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { TrendingTokenBanner } from '@/pages/TrendingTokens/components/banner/TrendingTokenBanner';
import { getUniqueTokenId } from '@core/types';
import { useNetworkContext, useBalancesContext } from '@core/ui';

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

export const AssetsTab: FC = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { getNetwork } = useNetworkContext();
  const { balances } = useBalancesContext();
  const [filterMenuElement, setFilterMenuElement] =
    useState<HTMLButtonElement | null>(null);
  const [sortMenuElement, setSortMenuElement] =
    useState<HTMLButtonElement | null>(null);
  const [sort, setSort] = useState<AssetSortOption | null>(null);
  const [selectedNetworks, setSelectedNetworks] = useState<Set<number>>(
    new Set(),
  );

  const assets = useAllTokensFromEnabledNetworks(true, true);
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

  const handleFilterMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFilterMenuElement(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuElement(null);
  };

  const handleSortMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortMenuElement(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuElement(null);
  };

  return (
    <Stack direction="column" gap={1.25} height={1}>
      <Box bgcolor="background.paper" borderRadius={2} px={2}>
        <TrendingTokenBanner />
      </Box>
      <Stack direction="row" gap={1.25}>
        <StyledButton
          endIcon={<MdKeyboardArrowDown size={20} />}
          onClick={handleFilterMenuClick}
        >
          {t('Filter')}
        </StyledButton>
        <StyledButton
          endIcon={<MdKeyboardArrowDown size={20} />}
          onClick={handleSortMenuClick}
        >
          {t('Sort')}
        </StyledButton>
        <Box ml="auto">
          <StyledButton onClick={() => push('/manage-tokens')}>
            {t('Manage')}
          </StyledButton>
        </Box>
      </Stack>
      <Stack width="100%" flexGrow={1} gap={1}>
        {hasError ? (
          <AssetsErrorState />
        ) : sortedAssets.length === 0 ? (
          <AssetsEmptyState />
        ) : (
          sortedAssets.map((token) => (
            <AssetCard key={getUniqueTokenId(token)} asset={token} />
          ))
        )}
      </Stack>
      <FilterMenu
        id="filter-menu"
        anchorEl={filterMenuElement}
        selected={selectedNetworks}
        onChange={setSelectedNetworks}
        networks={availableNetworks}
        open={Boolean(filterMenuElement)}
        onClose={handleFilterMenuClose}
      />
      <SortMenu
        id="sort-menu"
        anchorEl={sortMenuElement}
        sort={sort}
        onSortChange={setSort}
        open={Boolean(sortMenuElement)}
        onClose={handleSortMenuClose}
      />
    </Stack>
  );
};

const StyledButton = styled((buttonProps: ButtonProps) => (
  <Button
    variant="contained"
    color="secondary"
    size="xsmall"
    {...buttonProps}
  />
))(({ theme }) => ({
  paddingInline: theme.spacing(1.5),
}));
