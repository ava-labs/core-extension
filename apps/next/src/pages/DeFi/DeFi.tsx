import { FC, useMemo } from 'react';
import { useDefiContext, useFeatureFlagContext } from '@core/ui';
import { CircularProgress, Stack, PopoverItem, Box } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { DeFiZeroState } from './components/DeFiZeroState';
import { DeFiErrorState } from './components/DeFiErrorState';

import { DeFiProtocolList } from './components/DeFiProtocolList';
import { DefiProtocol, FeatureGates } from '@core/types';
import { DeFiSortOption, sortProtocols } from './utils/sortProtocols';
import { DeFiCommonContent } from './components/DeFiCommonContent';
import { DropdownMenu } from '@/components/DropdownMenu';
import { useDeFiQueryParams } from './hooks/useDefiQueryParams';

export const DeFi: FC = () => {
  const { portfolio, hasError, isLoading } = useDefiContext();
  const { filter, sort, setFilter, setSort } = useDeFiQueryParams();

  const { featureFlags } = useFeatureFlagContext();

  const hasProtocols = portfolio.protocols.length > 0;
  const isProperlyLoaded = !isLoading && !hasError;
  const isZeroState = isProperlyLoaded && !hasProtocols;

  const filteredProtocols = useMemo(() => {
    return portfolio.protocols.filter(
      (protocol) =>
        filter === null ||
        protocol.groups.some((group) =>
          group.items.some((item) => item.name === filter),
        ),
    );
  }, [portfolio.protocols, filter]);

  const sortedProtocols = useMemo(() => {
    return sortProtocols(filteredProtocols, sort);
  }, [filteredProtocols, sort]);

  if (!featureFlags[FeatureGates.DEFI]) {
    return <DeFiPortfolioFeatureDisabled />;
  }

  return (
    <Stack gap={1.25} height={1}>
      {isLoading && !hasProtocols && (
        // Only show the full loading screen if we have no data at all
        <Stack width="100%" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {isZeroState && <DeFiZeroState />}
      {hasError && <DeFiErrorState />}
      {!hasError && hasProtocols && (
        <>
          <Stack direction="row" gap={1}>
            <FilterMenu
              id="filter-menu"
              protocols={portfolio.protocols}
              setFilter={setFilter}
              filter={filter}
            />
            <SortMenu id="sort-menu" sort={sort} setSort={setSort} />
          </Stack>
          <DeFiProtocolList protocols={sortedProtocols} />
        </>
      )}
    </Stack>
  );
};

type FilterMenuProps = {
  id: string;
  protocols: DefiProtocol[];
  setFilter: (id: string | null) => void;
  filter: string | null;
};

const FilterMenu: FC<FilterMenuProps> = ({
  id,
  protocols,
  setFilter,
  filter,
}) => {
  const { t } = useTranslation();

  const protocolTypeNames = useMemo(() => {
    const uniqueTypeNames = new Set<string>();
    protocols.forEach((protocol) => {
      protocol.groups.forEach((group) => {
        group.items.forEach((item) => {
          uniqueTypeNames.add(item.name);
        });
      });
    });
    return Array.from(uniqueTypeNames);
  }, [protocols]);

  return (
    <Box id={id}>
      <DropdownMenu label={t('Filter')}>
        <PopoverItem onClick={() => setFilter(null)} selected={filter === null}>
          {t('All')}
        </PopoverItem>
        {protocolTypeNames.map((typeName) => (
          <PopoverItem
            key={typeName}
            onClick={() => {
              setFilter(typeName);
            }}
            selected={filter === typeName}
          >
            {typeName}
          </PopoverItem>
        ))}
      </DropdownMenu>
    </Box>
  );
};

type SortMenuProps = {
  id: string;
  sort: DeFiSortOption | null;
  setSort: (sort: DeFiSortOption | null) => void;
};

const SortMenu: FC<SortMenuProps> = ({ id, sort, setSort }) => {
  const { t } = useTranslation();

  const sortOptions: { label: string; value: DeFiSortOption }[] = [
    { label: t('Name A to Z'), value: 'name-asc' },
    { label: t('Name Z to A'), value: 'name-desc' },
    { label: t('Protocol'), value: 'protocol-asc' },
    { label: t('Network'), value: 'network-asc' },
    { label: t('Amount'), value: 'amount-desc' },
  ] as const;

  return (
    <Box id={id}>
      <DropdownMenu label={t('Sort')}>
        {sortOptions.map((option) => (
          <PopoverItem
            key={option.value}
            onClick={() => setSort(option.value)}
            selected={sort === option.value}
          >
            {option.label}
          </PopoverItem>
        ))}
      </DropdownMenu>
    </Box>
  );
};

export const DeFiPortfolioFeatureDisabled: FC = () => {
  const { t } = useTranslation();

  const content = useMemo(() => {
    return {
      title: t('DeFi Portfolio is currently unavailable'),
      description: t('Please check back later and try again.'),
      onClick: () => window.location.reload(),
      buttonLabel: t('Refresh'),
    };
  }, [t]);

  return <DeFiCommonContent {...content} />;
};
