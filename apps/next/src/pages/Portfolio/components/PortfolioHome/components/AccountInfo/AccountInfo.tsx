import { Stack, Typography, useTheme, WaterDropIcon } from '@avalabs/k2-alpine';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BalanceChange } from '../../../BalanceChange';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletSummaryInfo } from './components/WalletSummaryInfo';
import { AccountSummaryInfo } from './components/AccountSummaryInfo';
import { Account } from '@core/types';
import { AccountInfoSkeleton } from './components/AccountInfoSkeleton';
import { MdError, MdVisibilityOff } from 'react-icons/md';

type TotalBalance = ReturnType<typeof useBalancesContext>['totalBalance'];

type Props = {
  account?: Account;
  balance: TotalBalance;
  isDeveloperMode: boolean;
  hasBalanceError?: boolean;
  isLoading: boolean;
};

const fallbackTotalBalance: TotalBalance = {
  sum: null,
  priceChange: {
    value: 0,
    percentage: [],
  },
};

const getContainerProps = (withCoreAssistant: boolean) => ({
  width: '100%',
  mt: withCoreAssistant ? 3 : 1,
  pt: 1,
});

export const AccountInfo: FC<Props> = ({
  account,
  balance = fallbackTotalBalance,
  isDeveloperMode,
  hasBalanceError = false,
  isLoading,
}) => {
  const theme = useTheme();
  const { walletSummary } = useActiveAccountInfo();
  const { coreAssistant, privacyMode } = useSettingsContext();
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();
  const { sum, priceChange } = balance;
  const formattedSum =
    sum === null || isDeveloperMode || hasBalanceError || isLoading
      ? currencyFormatter(0).replace(/^(\D)0\.00$/, '$1–')
      : currencyFormatter(sum);

  const containerProps = getContainerProps(coreAssistant);

  if (!walletSummary || !account) {
    return <AccountInfoSkeleton {...containerProps} />;
  }

  return (
    <Stack {...containerProps}>
      <WalletSummaryInfo walletSummary={walletSummary} />
      <AccountSummaryInfo
        accountName={account.name}
        formattedSum={formattedSum}
        currency={!privacyMode ? currency : ''}
      />
      {isDeveloperMode ? (
        <Stack
          direction="row"
          color="green.light"
          gap={0.5}
          alignItems="center"
        >
          <WaterDropIcon size={16} />
          <Typography variant="subtitle3">{t('Testnet mode is on')}</Typography>
        </Stack>
      ) : hasBalanceError ? (
        <Stack direction="row" alignItems="center" gap={0.5} mt={1}>
          <MdError size={20} color={theme.palette.error.main} />
          <Typography variant="subtitle4" color="error">
            {<Trans i18nKey="Unable to load balance at this time" />}
          </Typography>
        </Stack>
      ) : !privacyMode ? (
        <BalanceChange
          balanceChange={priceChange.value}
          percentageChange={priceChange.percentage[0]}
        />
      ) : (
        <Stack direction="row" alignItems="center" gap={0.5}>
          <MdVisibilityOff size={16} />
          <Typography variant="subtitle3" fontWeight={600}>
            {t('Privacy mode is on')}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
