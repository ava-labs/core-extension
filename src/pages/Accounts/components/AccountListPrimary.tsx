import { Stack, SxProps } from '@avalabs/core-k2-components';

import {
  PrimaryAccount,
  WalletId,
} from '@src/background/services/accounts/models';
import { useWalletContext } from '@src/contexts/WalletProvider';

import { WalletContainer } from './WalletContainer';

type AccountListProps = {
  primaryAccount: Record<WalletId, PrimaryAccount[]>;
  sx?: SxProps;
};

export const AccountListPrimary = ({
  primaryAccount,
  sx,
}: AccountListProps) => {
  const { walletDetails: activeWalletDetails, wallets } = useWalletContext();

  return (
    <Stack sx={{ gap: 1, width: 1, ...sx }}>
      {Object.keys(primaryAccount).map((walletId) => {
        const walletAccounts = primaryAccount[walletId];
        const walletDetails = wallets.find((wallet) => wallet.id === walletId);

        if (!walletDetails) {
          return;
        }

        const isActive = activeWalletDetails?.id === walletId;

        if (walletAccounts && walletAccounts.length > 0) {
          return (
            <WalletContainer
              key={walletId}
              walletDetails={walletDetails}
              isActive={isActive}
              accounts={walletAccounts}
            />
          );
        }
      })}
    </Stack>
  );
};
