import { useHistory, useParams } from 'react-router-dom';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useCallback } from 'react';
import { Account } from '@core/types';
import { MdCircle } from 'react-icons/md';

export const WalletView = () => {
  const theme = useTheme();
  const { walletId } = useParams<{ walletId: string }>();
  const history = useHistory();
  const { getWallet } = useWalletContext();
  const { getAccountsByWalletId } = useAccountsContext();
  const { selectAccount, isActiveAccount } = useAccountsContext();

  const wallet = getWallet(walletId);
  const accountsInWallet = getAccountsByWalletId(walletId);

  const clickHandler = useCallback(
    (account: Account) => {
      selectAccount(account.id);
      history.push(`/portfolio`);
    },
    [history, selectAccount],
  );
  return (
    <>
      <div>{wallet?.name}</div>
      <div>
        {accountsInWallet.map((account) => (
          <Stack
            key={`wallet-${account.id}`}
            onClick={() => clickHandler(account)}
          >
            {isActiveAccount(account.id) && (
              <MdCircle color={theme.palette.success.main} />
            )}
            <Typography>{account.name}</Typography>
          </Stack>
        ))}
      </div>
    </>
  );
};
