import { FC, useState } from 'react';
import {
  Collapse,
  Divider,
  ListItemButton,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

import { AddressType } from '@core/types';

import { AccountItem } from './AccountItem';
import { type AccountGroup as AccountGroupType } from '../types';

type AccountGroupProps = {
  group: AccountGroupType;
  addressType: AddressType;
  selectedAccountId?: string;
  onAccountClick: (accountId: string) => void;
};

export const AccountGroup: FC<AccountGroupProps> = ({
  group,
  selectedAccountId,
  addressType,
  onAccountClick,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <ListItemButton
        data-item-id={group.id}
        disabled={group.items.length === 0}
        onClick={(ev) => {
          ev.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="subtitle3">{group.name}</Typography>
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </Stack>
      </ListItemButton>
      <Collapse in={isOpen}>
        <Divider sx={{ my: 0 }} />
        <Stack py={1}>
          {group.items.map((acc) => (
            <AccountItem
              key={acc.id}
              account={acc}
              isSelected={acc.id === selectedAccountId}
              addressType={addressType}
              onClick={onAccountClick}
            />
          ))}
        </Stack>
      </Collapse>
    </>
  );
};
