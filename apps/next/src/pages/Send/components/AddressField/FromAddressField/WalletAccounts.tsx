import { FC, useState } from 'react';
import {
  Collapse,
  Divider,
  ListItemButton,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

import {
  AddressType,
  ImportedAccount,
  PrimaryAccount,
  WalletDetails,
} from '@core/types';

import { AccountItem } from './AccountItem';

type WalletAccountsProps = {
  selectedAccountId?: string;
  wallet: WalletDetails & { accounts: PrimaryAccount[] | ImportedAccount[] };
  addressType: AddressType;
  onAccountClick: (accountId: string) => void;
};

export const WalletAccounts: FC<WalletAccountsProps> = ({
  wallet,
  selectedAccountId,
  addressType,
  onAccountClick,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <ListItemButton
        data-item-id={wallet.id}
        disabled={wallet.accounts.length === 0}
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
          <Typography variant="subtitle3">{wallet.name}</Typography>
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </Stack>
      </ListItemButton>
      <Divider />
      <Collapse in={isOpen}>
        <Stack py={1}>
          {wallet.accounts.map((acc) => (
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
