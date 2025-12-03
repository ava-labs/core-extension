import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { ClickableStack } from '../styled';
import { AddressList } from '@/components/AddressList';
import { Account } from '@core/types';
import { useState } from 'react';

type Props = {
  account?: Account;
  accountName: string;
  formattedSum: string;
  currency: string;
};

export const AccountSummaryInfo = ({
  account,
  accountName,
  formattedSum,
  currency,
}: Props) => {
  const history = useHistory();
  const theme = useTheme();
  const [isAddressListHovered, setIsAddressListHovered] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  return (
    <Stack position="relative" overflow="visible">
      <ClickableStack
        onClick={() => {
          history.push('/account-management');
        }}
        onMouseEnter={() => setIsAccountHovered(true)}
        onMouseLeave={() => setIsAccountHovered(false)}
      >
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography variant="h2" color="text.secondary">
            {accountName}
          </Typography>
          <MdUnfoldMore size={16} color={theme.palette.text.secondary} />
        </Stack>

        <Stack direction="row" alignItems="baseline" gap={0.5}>
          <Typography variant="h2">{formattedSum}</Typography>
          <Typography variant="body3">{currency}</Typography>
        </Stack>
      </ClickableStack>
      <AddressList
        isAddressAppear={isAccountHovered || isAddressListHovered}
        activeAccount={account}
        onMouseEnter={() => setIsAddressListHovered(true)}
        onMouseLeave={() => setIsAddressListHovered(false)}
      />
    </Stack>
  );
};
