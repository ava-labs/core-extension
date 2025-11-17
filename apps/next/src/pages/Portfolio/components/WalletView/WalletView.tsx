import { useHistory, useParams } from 'react-router-dom';
import {
  useAccountsContext,
  useSettingsContext,
  useWalletContext,
  useWalletTotalBalance,
  WalletTotalBalanceProvider,
} from '@core/ui';
import {
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useCallback } from 'react';
import { Account } from '@core/types';
import { MdCircle } from 'react-icons/md';
import { WalletIcon } from '@/components/WalletIcon';
import { useTranslation } from 'react-i18next';
import { BalanceChange } from '../BalanceChange';

const WalletViewContent = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { walletId } = useParams<{ walletId: string }>();
  const history = useHistory();
  const { getWallet } = useWalletContext();
  const { getAccountsByWalletId } = useAccountsContext();
  const { selectAccount, isActiveAccount } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();

  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    balanceChange,
    percentageChange,
  } = useWalletTotalBalance(walletId);

  console.log({ balanceChange, percentageChange });
  const wallet = getWallet(walletId);
  const accountsInWallet = getAccountsByWalletId(walletId);

  const clickHandler = useCallback(
    (account: Account) => {
      selectAccount(account.id);
      history.push(`/portfolio`);
    },
    [history, selectAccount],
  );

  if (!wallet) return null;

  return (
    <Stack p={2} gap={1}>
      <Stack direction="row" alignItems="center" gap={1} color="text.secondary">
        <WalletIcon
          size="large"
          type={wallet.type}
          authProvider={wallet.authProvider}
        />
        <Typography variant="h2">{wallet?.name}</Typography>
      </Stack>
      {isLoading && <CircularProgress size={14} />}
      {!isLoading && hasErrorOccurred && (
        <Typography variant="h3" color="error">
          {t('Unable to load balances')}
        </Typography>
      )}
      {!isLoading && !hasErrorOccurred && (
        <>
          <Stack direction="row" alignItems="baseline" gap={0.5} ml={0.5}>
            <Typography variant="h2">
              {currencyFormatter(totalBalanceInCurrency ?? 0)}
            </Typography>
            <Typography variant="h7">{currency}</Typography>
          </Stack>
          <BalanceChange
            balanceChange={balanceChange}
            percentageChange={percentageChange}
          />
        </>
      )}
      <Stack>
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
      </Stack>
    </Stack>
    // <>
    //   <div>{wallet?.name}</div>
    //   <div>
    //     {accountsInWallet.map((account) => (
    //       <Stack
    //         key={`wallet-${account.id}`}
    //         onClick={() => clickHandler(account)}
    //       >
    //         {isActiveAccount(account.id) && (
    //           <MdCircle color={theme.palette.success.main} />
    //         )}
    //         <Typography>{account.name}</Typography>
    //       </Stack>
    //     ))}
    //   </div>
    // </>
  );
};

export const WalletView = () => {
  return (
    <WalletTotalBalanceProvider>
      <WalletViewContent />
    </WalletTotalBalanceProvider>
  );
};
