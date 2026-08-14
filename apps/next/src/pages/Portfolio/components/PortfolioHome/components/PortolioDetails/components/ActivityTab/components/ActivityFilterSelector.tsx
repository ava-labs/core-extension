import { DropdownMenu } from '@/components/DropdownMenu';
import { Box, PopoverItem } from '@avalabs/k2-alpine';
import { FC, RefObject, useMemo } from 'react';
import { ActivityFilter } from '../types';
import { useTranslation } from 'react-i18next';

type Props = {
  selected: ActivityFilter;
  onChange(filter: ActivityFilter): void;
  ref?: RefObject<HTMLElement>;
  exclude?: ActivityFilter[];
};

const ACTIVITY_FILTERS: ActivityFilter[] = [
  'All',
  'Sent',
  'Received',
  'Swap',
  'Bridge',
  'NFT',
  'Contract_Call',
];

export const ActivityFilterSelector: FC<Props> = ({
  selected,
  onChange,
  ref,
  exclude,
}) => {
  const { t } = useTranslation();
  const filteredActivityFilters = useMemo(() => {
    return ACTIVITY_FILTERS.filter((filter) => !exclude?.includes(filter));
  }, [exclude]);

  return (
    <Box ref={ref} data-testid="activity-filter-trigger">
      <DropdownMenu label={t('Filter')}>
        {filteredActivityFilters.map((filterName) => (
          <PopoverItem
            key={filterName}
            onClick={() => onChange(filterName)}
            selected={filterName === selected}
          >
            <span data-testid={`activity-filter-option-${filterName}`}>
              {filterName.replace('_', ' ')}
            </span>
          </PopoverItem>
        ))}
      </DropdownMenu>
    </Box>
  );
};
