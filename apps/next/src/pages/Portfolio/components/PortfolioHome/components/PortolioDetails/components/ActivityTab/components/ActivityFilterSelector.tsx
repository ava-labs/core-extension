import { DropdownMenu } from '@/components/DropdownMenu';
import { Box, MenuItem, styled } from '@avalabs/k2-alpine';
import { FC, RefObject } from 'react';
import { MdCheck } from 'react-icons/md';
import { ActivityFilter } from '../types';

type Props = {
  selected: ActivityFilter;
  onChange(filter: ActivityFilter): void;
  ref?: RefObject<HTMLElement>;
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

export const ActivityFilterSelector: FC<Props> = ({
  selected,
  onChange,
  ref,
}) => {
  return (
    <Box ref={ref}>
      <DropdownMenu
        label={selected === 'All' ? 'Filter' : selected.replace('_', ' ')}
      >
        {ACTIVITY_FILTERS.map((filterName) => (
          <StyledMenuItem
            key={filterName}
            onClick={() => onChange(filterName)}
            dense
          >
            {filterName.replace('_', ' ')}
            {filterName === selected && <MdCheck size={16} />}
          </StyledMenuItem>
        ))}
      </DropdownMenu>
    </Box>
  );
};

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));
