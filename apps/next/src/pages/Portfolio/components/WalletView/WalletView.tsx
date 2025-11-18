import { useParams } from 'react-router-dom';
import {
  useAccountsContext,
  useSettingsContext,
  useWalletContext,
  useWalletTotalBalance,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';

import { WalletIcon } from '@/components/WalletIcon';
import { useTranslation } from 'react-i18next';
import { BalanceChange } from '../BalanceChange';
import { PortfolioActionButtons } from '../PortfolioHome/components/PortolioDetails/components/PortfolioActionButtons';
import { Card } from '@/components/Card';
import { WalletAccount } from './components/WalletAccount';

const WalletViewContent = () => {
  const { t } = useTranslation();
  const { walletId } = useParams<{ walletId: string }>();
  const { getWallet } = useWalletContext();
  const { getAccountsByWalletId } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();

  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    balanceChange,
    percentageChange,
  } = useWalletTotalBalance(walletId);

  const wallet = getWallet(walletId);
  const accountsInWallet = getAccountsByWalletId(walletId);

  if (!wallet) return null;

  return (
    <Stack p={2} gap={1}>
      <Stack gap={1}>
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          color="text.secondary"
        >
          <WalletIcon
            size="large"
            type={wallet.type}
            authProvider={wallet.authProvider}
          />
          <Typography variant="h2">{wallet?.name}</Typography>
        </Stack>
        {isLoading && (
          <Stack height={56.5} justifyContent="center">
            <CircularProgress size={14} />
          </Stack>
        )}
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
      </Stack>
      <PortfolioActionButtons />

      <Card
        sx={{
          backgroundColor: 'background.paper',
          padding: 2,
          marginTop: 1.5,
          overflow: 'visible',
        }}
      >
        <Typography variant="h3">{t('Accounts')}</Typography>
        <Typography variant="body1">
          {t('This wallet has 4 accounts over 6 networks')}
          {/* TODO: replace with the actual number of accounts and networks */}
        </Typography>

        {accountsInWallet.map((account, index) => (
          <WalletAccount
            key={account.id}
            account={account}
            isFirst={index === 0}
          />
        ))}
      </Card>
    </Stack>
  );
};

export const WalletView = () => {
  return (
    <WalletTotalBalanceProvider>
      <WalletViewContent />
    </WalletTotalBalanceProvider>
  );
};
