import { Stack, Typography, WaterDropIcon } from '@avalabs/k2-alpine';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { FC, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BalanceChange } from '../../../BalanceChange';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletSummaryInfo } from './components/WalletSummaryInfo';
import { AccountSummaryInfo } from './components/AccountSummaryInfo';
import { Account } from '@core/types';
import { useAccountInfoVisibility } from '@/contexts/AccountInfoVisibilityContext';

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
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();
  const { setAccountInfoElement } = useAccountInfoVisibility();
  const [accountSummaryWidth, setAccountSummaryWidth] = useState<number>(0);
  const { sum, priceChange } = balance;
  const formattedSum = currencyFormatter(sum ?? 0).replace(
    /^(\D)0\.00$/,
    '$1–',
  );

  const handleWidthChange = useCallback((width: number) => {
    setAccountSummaryWidth(width);
  }, []);

  return (
    <Stack ref={setAccountInfoElement} gap={0.25} sx={{ mt: 5, width: '100%' }}>
      <WalletSummaryInfo
        walletSummary={walletSummary}
        maxWidth={accountSummaryWidth || undefined}
      />
      <AccountSummaryInfo
        account={account}
        accountName={account?.name ?? ''}
        formattedSum={formattedSum}
        currency={currency}
        onWidthChange={handleWidthChange}
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
