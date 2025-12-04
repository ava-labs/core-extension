import { DropdownMenu } from '@/components/DropdownMenu';
import { Box, PopoverItem } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { ActivityFilter } from '../types';
import { useTranslation } from 'react-i18next';

type Props = {
  selected: ActivityFilter;
  onChange(filter: ActivityFilter): void;
};

const ACTIVITY_FILTERS: ActivityFilter[] = [
  'All',
  'Bridge',
  'Incoming',
  'Outgoing',
  'Contract_Call',
  'Swap',
  'NFTs',
];

export const ActivityFilterSelector: FC<Props> = ({ selected, onChange }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <DropdownMenu label={t('Filter')}>
        {ACTIVITY_FILTERS.map((filterName) => (
          <PopoverItem
            key={filterName}
            onClick={() => onChange(filterName)}
            selected={filterName === selected}
          >
            {filterName.replace('_', ' ')}
          </PopoverItem>
        ))}
      </DropdownMenu>
    </Box>
  );
};
