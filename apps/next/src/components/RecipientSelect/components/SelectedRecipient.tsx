import { useMemo } from 'react';
import {
  AvatarHex,
  Box,
  Stack,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';

import { useWalletContext } from '@core/ui';
import { isPrimaryAccount } from '@core/common';
import { AddressType, SecretType } from '@core/types';

import { WalletIcon } from '@/components/WalletIcon';
import { HexagonalIcon } from '@/components/HexagonalIcon';

import { Recipient } from '../types';
import { useRecipientName } from '../hooks/useRecipientName';
import { getRecipientAddressByType } from '../lib/getRecipientAddressByType';
import { FaQuestion } from 'react-icons/fa6';

type SelectedRecipientProps = {
  recipient: Recipient;
  addressType: AddressType;
};

export const SelectedRecipient = ({
  recipient,
  addressType,
}: SelectedRecipientProps) => {
  const { getWallet } = useWalletContext();

  const getRecipientName = useRecipientName();

  const name = useMemo(
    () => getRecipientName(recipient),
    [recipient, getRecipientName],
  );

  const address = useMemo(
    () => getRecipientAddressByType(recipient, addressType),
    [recipient, addressType],
  );

  const icon = useMemo(() => {
    switch (recipient.type) {
      case 'account': {
        const wallet = isPrimaryAccount(recipient.account)
          ? getWallet(recipient.account.walletId)
          : null;

        return (
          <HexagonalIcon size={36}>
            <WalletIcon
              type={wallet?.type ?? SecretType.PrivateKey}
              authProvider={wallet?.authProvider}
            />
          </HexagonalIcon>
        );
      }
      case 'contact':
        return <AvatarHex size="medium" alt={recipient.contact.name} />;
      default:
        return (
          <HexagonalIcon size={36}>
            <Box display="flex" color="text.secondary">
              <FaQuestion />
            </Box>
          </HexagonalIcon>
        );
    }
  }, [recipient, getWallet]);

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Stack textAlign="end">
        <Typography
          variant="body3"
          color="text.primary"
          fontWeight="fontWeightMedium"
        >
          {name}
        </Typography>
        <Typography variant="mono" color="text.secondary">
          {truncateAddress(address ?? '', 10)}
        </Typography>
      </Stack>
      <Box display="flex" flex={1}>
        {icon}
      </Box>
    </Stack>
  );
};
