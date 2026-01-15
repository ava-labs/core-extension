import { Stack, Typography, WaterDropIcon } from '@avalabs/k2-alpine';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BalanceChange } from '../../../BalanceChange';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletSummaryInfo } from './components/WalletSummaryInfo';
import { AccountSummaryInfo } from './components/AccountSummaryInfo';
import { Account } from '@core/types';
import { AccountInfoSkeleton } from './components/AccountInfoSkeleton';
import { MdVisibilityOff } from 'react-icons/md';

type TotalBalance = ReturnType<typeof useBalancesContext>['totalBalance'];

type Props = {
  account?: Account;
  balance: TotalBalance;
  isDeveloperMode: boolean;
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
}) => {
  const { walletSummary } = useActiveAccountInfo();
  const { coreAssistant, privacyMode } = useSettingsContext();
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();
  const { sum, priceChange } = balance;
  const formattedSum = currencyFormatter(sum ?? 0).replace(
    /^(\D)0\.00$/,
    '$1–',
  );

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
      ) : !privacyMode ? (
        <BalanceChange
          balanceChange={priceChange.value}
          percentageChange={priceChange.percentage[0]}
        />
      ) : (
        <Stack direction="row" alignItems="center" gap={0.5} mb={3}>
          <MdVisibilityOff size={16} />
          <Typography variant="subtitle3" fontWeight={600}>
            {t('Privacy mode is on')}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
