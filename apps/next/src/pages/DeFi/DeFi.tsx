import { FC, useMemo, useState } from 'react';
import { MdCheck, MdKeyboardArrowDown } from 'react-icons/md';
import { useDefiContext, useFeatureFlagContext } from '@core/ui';
import {
  Button,
  ButtonProps,
  CircularProgress,
  List,
  ListItemText,
  Stack,
  styled,
  Popover,
  ListItemButton,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { DeFiZeroState } from './components/DeFiZeroState';
import { DeFiErrorState } from './components/DeFiErrorState';

import { DeFiProtocolList } from './components/DeFiProtocolList';
import { DefiProtocol, FeatureGates } from '@core/types';
import { DeFiSortOption, sortProtocols } from './utils/sortProtocols';
import { DeFiCommonContent } from './components/DeFiCommonContent';

export const DeFi: FC = () => {
  const { portfolio, hasError, isLoading } = useDefiContext();
  const [filterMenu, setFilterMenu] = useState<HTMLButtonElement | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortMenu, setSortMenu] = useState<HTMLButtonElement | null>(null);
  const [sort, setSort] = useState<DeFiSortOption | null>(null);

  const { featureFlags } = useFeatureFlagContext();

  const handleFilterMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFilterMenu(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenu(null);
  };

  const hasProtocols = portfolio.protocols.length > 0;
  const isProperlyLoaded = !isLoading && !hasError;
  const isZeroState = isProperlyLoaded && !hasProtocols;

  const { t } = useTranslation();

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

  const handleSortMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortMenu(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenu(null);
  };

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
          </Stack>
          <DeFiProtocolList protocols={sortedProtocols} />
          <FilterMenu
            id="filter-menu"
            anchorEl={filterMenu}
            protocols={portfolio.protocols}
            setFilter={setFilter}
            filter={filter}
            open={Boolean(filterMenu)}
            onClose={handleFilterMenuClose}
          />
          <SortMenu
            id="sort-menu"
            anchorEl={sortMenu}
            sort={sort}
            setSort={setSort}
            open={Boolean(sortMenu)}
            onClose={handleSortMenuClose}
          />
        </>
      )}
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

type FilterMenuProps = {
  id: string;
  anchorEl: HTMLButtonElement | null;
  protocols: DefiProtocol[];
  setFilter: (id: string | null) => void;
  filter: string | null;
  open: boolean;
  onClose: () => void;
};

const FilterMenu: FC<FilterMenuProps> = ({
  id,
  anchorEl,
  protocols,
  setFilter,
  filter,
  open,
  onClose,
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
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            minWidth: 200,
            paddingX: 1,
          },
        },
      }}
    >
      <List>
        <ListItemButton
          dense
          sx={{
            paddingY: 0.5,
            borderRadius: 1,
          }}
          onClick={() => {
            setFilter(null);
            onClose();
          }}
          selected={filter === null}
        >
          <ListItemText primary={t('All')} />
        </ListItemButton>
        {protocolTypeNames.map((typeName) => (
          <ListItemButton
            key={typeName}
            dense
            sx={{
              paddingY: 0.5,
              borderRadius: 1,
            }}
            onClick={() => {
              setFilter(typeName);
              onClose();
            }}
          >
            <ListItemText primary={typeName} />
            {filter === typeName && <MdCheck size={16} />}
          </ListItemButton>
        ))}
      </List>
    </Popover>
  );
};

type SortMenuProps = {
  id: string;
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  onClose: () => void;
  sort: DeFiSortOption | null;
  setSort: (sort: DeFiSortOption | null) => void;
};

const SortMenu: FC<SortMenuProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  sort,
  setSort,
}) => {
  const { t } = useTranslation();

  const sortOptions: { label: string; value: DeFiSortOption }[] = [
    { label: t('Name A to Z'), value: 'name-asc' },
    { label: t('Name Z to A'), value: 'name-desc' },
    { label: t('Protocol'), value: 'protocol-asc' },
    { label: t('Network'), value: 'network-asc' },
    { label: t('Amount'), value: 'amount-desc' },
  ] as const;

  return (
    <Popover id={id} open={open} anchorEl={anchorEl} onClose={onClose}>
      <List>
        {sortOptions.map((option) => (
          <ListItemButton
            key={option.value}
            dense
            sx={{
              paddingY: 0.5,
              borderRadius: 1,
            }}
            onClick={() => {
              setSort(option.value);
              onClose();
            }}
            selected={sort === option.value}
          >
            <ListItemText primary={option.label} />
            {sort === option.value && <MdCheck size={16} />}
          </ListItemButton>
        ))}
      </List>
    </Popover>
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
