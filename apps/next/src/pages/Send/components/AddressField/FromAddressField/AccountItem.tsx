import { FC, useState } from 'react';
import {
  Fade,
  MenuItem,
  Stack,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';
import { FaCheck } from 'react-icons/fa';

import { AddressType, ImportedAccount, PrimaryAccount } from '@core/types';
import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
} from '@core/ui';

import { getAddressByType } from '@/utils/getAddressByType';

type AccountItemProps = {
  account: PrimaryAccount | ImportedAccount;
  addressType: AddressType;
  isSelected: boolean;
  onClick: (accountId: string) => void;
};

export const AccountItem: FC<AccountItemProps> = ({
  account,
  addressType,
  isSelected,
  onClick,
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const { getAccountById } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();
  const fromAccountBalance = useBalanceTotalInCurrency(
    getAccountById(account.id),
  );

  return (
    <MenuItem
      data-item-id={account.id}
      sx={{
        mx: 1.25,
        borderRadius: 1,
        px: 1.5,
        minHeight: 'unset',
        width: 'auto',
      }}
      onMouseEnter={() => setShowBalance(true)}
      onMouseLeave={() => setShowBalance(false)}
      onFocus={() => setShowBalance(true)}
      onBlur={() => setShowBalance(false)}
      onClick={() => onClick(account.id)}
      value={account.id}
    >
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <Stack gap={0.25}>
          <Typography variant="body3">{account.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {truncateAddress(getAddressByType(account, addressType) ?? '', 20)}
          </Typography>
        </Stack>

        <Stack position="relative" height={12}>
          <Fade in={showBalance} mountOnEnter unmountOnExit>
            <Typography
              className="balance"
              position="absolute"
              right={0}
              variant="caption"
              color="text.secondary"
            >
              {currencyFormatter(fromAccountBalance?.sum ?? 0)}
            </Typography>
          </Fade>
          <Fade in={isSelected && !showBalance} mountOnEnter unmountOnExit>
            <FaCheck
              className="check"
              style={{ position: 'absolute', right: 0 }}
            />
          </Fade>
        </Stack>
      </Stack>
    </MenuItem>
  );
};
