import { Stack, SxProps } from '@avalabs/core-k2-components';

import {
  PrimaryAccount,
  WalletId,
} from 'packages/service-worker/src/services/accounts/models';
import { useWalletContext } from '@src/contexts/WalletProvider';

import { WalletContainer } from './WalletContainer';

type AccountListProps = {
  primaryAccounts: Record<WalletId, PrimaryAccount[]>;
  sx?: SxProps;
};

export const AccountListPrimary = ({
  primaryAccounts,
  sx,
}: AccountListProps) => {
  const { walletDetails: activeWalletDetails, wallets } = useWalletContext();

  return (
    <Stack sx={{ gap: 1, width: 1, ...sx }}>
      {Object.keys(primaryAccounts).map((walletId) => {
        const walletAccounts = primaryAccounts[walletId];
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
