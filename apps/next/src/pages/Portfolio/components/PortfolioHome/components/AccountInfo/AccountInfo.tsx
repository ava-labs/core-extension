import { Stack, Typography, WaterDropIcon } from '@avalabs/k2-alpine';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BalanceChange } from '../../../BalanceChange';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletSummaryInfo } from './components/WalletSummaryInfo';
import { AccountSummaryInfo } from './components/AccountSummaryInfo';
import { Account } from '@core/types';

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

export const AccountInfo: FC<Props> = ({
  account,
  balance = fallbackTotalBalance,
  isDeveloperMode,
}) => {
  const { walletSummary } = useActiveAccountInfo();
  const { coreAssistant } = useSettingsContext();
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();
  const { sum, priceChange } = balance;
  const formattedSum = currencyFormatter(sum ?? 0).replace(
    /^(\D)0\.00$/,
    '$1–',
  );

  return (
    <Stack gap={0.25} width="100%" mt={coreAssistant ? 3 : 1} pt={1}>
      <WalletSummaryInfo walletSummary={walletSummary} />
      <AccountSummaryInfo
        accountName={account?.name ?? ''}
        formattedSum={formattedSum}
        currency={currency}
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
      ) : (
        <BalanceChange
          balanceChange={priceChange.value}
          percentageChange={priceChange.percentage[0]}
        />
      )}
    </Stack>
  );
};

export default AccountInfo;
