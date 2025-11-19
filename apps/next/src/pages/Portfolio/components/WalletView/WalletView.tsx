import { useParams } from 'react-router-dom';
import {
  useAccountsContext,
  useBalancesContext,
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

import { WalletIcon } from '@/components/WalletIcon';
import { Trans, useTranslation } from 'react-i18next';
import { BalanceChange } from '../BalanceChange';
import { PortfolioActionButtons } from '../PortfolioHome/components/PortolioDetails/components/PortfolioActionButtons';
import { Card } from '@/components/Card';
import { WalletAccount } from './components/WalletAccount';
import {
  usePersonalAvatar,
  type PersonalAvatarName,
} from '@/components/PersonalAvatar';
import { useMemo } from 'react';
import { useNetworksWithBalance } from './hooks/useNetworksWithBalance';
import { MdError } from 'react-icons/md';
import { modifyFractionNumber } from '@core/ui/src/contexts/utils/getCurrencyFormatter';

// Avatars from avatar-dictionary.ts
const ACCOUNT_AVATAR_OPTIONS: PersonalAvatarName[] = [
  'abstract-1.svg',
  'abstract-2.svg',
  'abstract-3.svg',
  'abstract-4.svg',
  'abstract-5.svg',
  'art-1.svg',
  'art-10.svg',
  'art-2.svg',
  'art-3.svg',
  'art-4.svg',
  'art-5.svg',
  'art-6.svg',
  'art-7.svg',
  'art-8.svg',
  'art-9.svg',
];

const WalletViewContent = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { walletId } = useParams<{ walletId: string }>();
  const { getWallet } = useWalletContext();
  const { getAccountsByWalletId } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();
  const {
    selected: { name: userAvatarName },
  } = usePersonalAvatar();
  const networksWithBalance = useNetworksWithBalance(walletId);
  const { getTotalBalance } = useBalancesContext();

  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    balanceChange,
    percentageChange,
  } = useWalletTotalBalance(walletId);

  const wallet = getWallet(walletId);
  const accountsInWallet = getAccountsByWalletId(walletId);

  // Generate unique avatars for each account
  const accountAvatars = useMemo(() => {
    const availableAvatars = ACCOUNT_AVATAR_OPTIONS.filter(
      (avatar) => avatar !== userAvatarName,
    );

    // If user's avatar removed all options, use original list
    const avatarsToUse =
      availableAvatars.length > 0 ? availableAvatars : ACCOUNT_AVATAR_OPTIONS;

    const avatarMap = new Map<string, PersonalAvatarName>();
    accountsInWallet.forEach((account, index) => {
      const avatarIndex = index % avatarsToUse.length;
      const selectedAvatar = avatarsToUse[avatarIndex];
      if (selectedAvatar) {
        avatarMap.set(account.id, selectedAvatar);
      }
    });

    return avatarMap;
  }, [accountsInWallet, userAvatarName]);
  const accountCount = useMemo(() => {
    return Object.keys(networksWithBalance).length;
  }, [networksWithBalance]);

  const networkCount = useMemo(() => {
    const allNetworks = Object.values(networksWithBalance).flat();
    const uniqueChainIds = new Set(
      allNetworks.map((network) => network.chainId),
    );
    return uniqueChainIds.size;
  }, [networksWithBalance]);

  // If fetching total wallet balance fails, add up the balances of all accounts as a backup
  const backupTotalBalance = useMemo(() => {
    let totalBalance = 0;
    for (const account of accountsInWallet) {
      const accountTotalBalance = getTotalBalance(account.addressC);
      if (accountTotalBalance && accountTotalBalance.sum) {
        totalBalance += modifyFractionNumber(accountTotalBalance.sum);
      }
    }
    return totalBalance;
  }, [accountsInWallet, getTotalBalance]);

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
            size={29}
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
        {!isLoading && (
          <>
            <Stack direction="row" alignItems="baseline" gap={0.5} ml={0.5}>
              <Typography variant="h2">
                {totalBalanceInCurrency !== undefined
                  ? currencyFormatter(totalBalanceInCurrency)
                  : backupTotalBalance !== undefined
                    ? currencyFormatter(backupTotalBalance)
                    : '-'}
              </Typography>
              <Typography variant="h7">{currency}</Typography>
            </Stack>
            <BalanceChange
              balanceChange={balanceChange}
              percentageChange={percentageChange}
            />
            {hasErrorOccurred && (
              <Stack direction="row" alignItems="center" gap={0.5}>
                <MdError size={20} color={theme.palette.error.main} />
                <Typography variant="subtitle4" color="error">
                  {
                    <Trans i18nKey="Unable to load all network balances, <br /> total may be incomplete" />
                  }
                </Typography>
              </Stack>
            )}
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
        <Typography variant="subtitle4" mb={2}>
          {t(
            'This wallet has {{accountCount}} {{accountUnit}} over {{networkCount}} {{networkUnit}}',
            {
              accountCount,
              networkCount,
              accountUnit: accountCount > 1 ? t('accounts') : t('account'),
              networkUnit: networkCount > 1 ? t('networks') : t('network'),
            },
          )}
        </Typography>

        {accountsInWallet.map((account, index) => (
          <WalletAccount
            key={account.id}
            account={account}
            isFirst={index === 0}
            avatarName={accountAvatars.get(account.id) ?? 'abstract-1.svg'}
            networksWithBalance={networksWithBalance[account.id] ?? []}
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
