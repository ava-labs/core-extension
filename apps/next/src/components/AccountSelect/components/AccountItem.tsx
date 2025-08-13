import { FC, useState } from 'react';
import {
  Fade,
  MenuItem,
  Stack,
  styled,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';
import { FaCheck } from 'react-icons/fa';

import {
  useAccountsContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
} from '@core/ui';
import { AddressType, ImportedAccount, PrimaryAccount } from '@core/types';

import { getAddressByType } from '@/utils/getAddressByType';

type AccountItemProps = {
  account: PrimaryAccount | ImportedAccount;
  addressType: AddressType;
  isSelected: boolean;
};

export const AccountItem: FC<AccountItemProps> = ({
  account,
  addressType,
  isSelected,
  ...rest
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const { getAccountById } = useAccountsContext();
  const { currencyFormatter } = useSettingsContext();
  const fromAccountBalance = useBalanceTotalInCurrency(
    getAccountById(account.id),
  );

  return (
    <StyledMenuItem
      onMouseEnter={() => setShowBalance(true)}
      onMouseLeave={() => setShowBalance(false)}
      onFocus={() => setShowBalance(true)}
      onBlur={() => setShowBalance(false)}
      value={account.id}
      {...rest}
    >
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <Stack gap={0.25}>
          <Typography variant="body2" fontWeight="fontWeightMedium">
            {account.name}
          </Typography>
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
    </StyledMenuItem>
  );
};

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  marginInline: theme.spacing(1.25),
  borderRadius: theme.shape.borderRadius,
  paddingInline: theme.spacing(1.5),
  minHeight: 'unset',
  width: 'auto',
}));
