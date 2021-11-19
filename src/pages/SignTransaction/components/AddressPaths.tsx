import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  LinkIcon,
  SecondaryCard,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { getAddressLink } from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { openNewTab } from '@src/utils/extensionUtils';
import { truncateAddress } from '@src/utils/truncateAddress';
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components';

export function AddressPaths({
  fromAddress,
  toAddress,
}: {
  fromAddress: string;
  toAddress: string;
}) {
  const { accounts } = useAccountsContext();
  const theme = useTheme();

  const account = useMemo(() => {
    return accounts.find((acc) => {
      return acc.addressC.toLowerCase() === fromAddress.toLowerCase();
    });
  }, [accounts]);

  return (
    <SecondaryCard width="100%" padding={'8px 16px'}>
      <HorizontalFlex width="100%" justify="space-between" align="center">
        <Typography size={12} height="15px">
          {account?.name ?? truncateAddress(fromAddress, 8)}
        </Typography>
        <CaretIcon
          height="15px"
          direction={IconDirection.RIGHT}
          color={theme.colors.icon1}
        />
        <TextButton
          onClick={() => openNewTab({ url: getAddressLink(toAddress) })}
        >
          <HorizontalFlex align="center">
            <AvaxTokenIcon height="15px" />
            <Typography size={12} height="15px" margin={'0 5px 0 5px'}>
              {truncateAddress(toAddress, 8)}
            </Typography>
            <LinkIcon color={theme.colors.icon1} height={'12px'} />
          </HorizontalFlex>
        </TextButton>
      </HorizontalFlex>
    </SecondaryCard>
  );
}
