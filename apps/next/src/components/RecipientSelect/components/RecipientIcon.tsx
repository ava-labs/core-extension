import { FaQuestion } from 'react-icons/fa6';
import { AvatarHex, Box } from '@avalabs/k2-alpine';

import { SecretType } from '@core/types';
import { isPrimaryAccount } from '@core/common';
import { useWalletContext } from '@core/ui';

import { WalletIcon } from '@/components/WalletIcon/WalletIcon';
import { HexagonalIcon } from '@/components/HexagonalIcon';

import { Recipient } from '../types';

type RecipientIconProps = {
  recipient: Recipient;
};

export const RecipientIcon = ({ recipient }: RecipientIconProps) => {
  const { getWallet } = useWalletContext();

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
      return <AvatarHex size="xsmall" alt={recipient.contact.name} />;
    default:
      return (
        <HexagonalIcon size={36}>
          <Box display="flex" color="text.secondary">
            <FaQuestion />
          </Box>
        </HexagonalIcon>
      );
  }
};
