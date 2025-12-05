import { Stack, Typography, WaterDropIcon } from '@avalabs/k2-alpine';
import {
  AccountAtomicBalanceState,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BalanceChange } from '../../BalanceChange';

type TotalBalance = ReturnType<typeof useBalancesContext>['totalBalance'];

type Props = {
  accountName: string;
  balance: TotalBalance;
  atomicBalance?: AccountAtomicBalanceState;
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
  accountName,
  balance = fallbackTotalBalance,
  atomicBalance,
  isDeveloperMode,
}) => {
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();
  const { sum, priceChange } = balance;
  const formattedSum = currencyFormatter(
    (sum ?? 0) + (atomicBalance?.balanceInCurrency ?? 0),
  ).replace(/^(\D)0\.00$/, '$1–');

  return (
    <Stack spacing={0.5} mt={4.5}>
      <Typography variant="h2" color="text.secondary">
        {accountName}
      </Typography>
      <Stack direction="row" alignItems="baseline" gap={0.5}>
        <Typography variant="h2">{formattedSum}</Typography>
        <Typography variant="body3">{currency}</Typography>
      </Stack>
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
