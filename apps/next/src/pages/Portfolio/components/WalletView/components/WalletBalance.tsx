import { WalletIcon } from '@/components/WalletIcon';
import {
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { BalanceChange } from '../../BalanceChange';
import { MdError } from 'react-icons/md';
import { Trans } from 'react-i18next';
import { SecretType, WalletDetails } from '@core/types';
import { useMemo } from 'react';
import { useSettingsContext, useWalletTotalBalance } from '@core/ui';

type Props = {
  wallet: WalletDetails;
};
export const WalletBalance = ({ wallet }: Props) => {
  const theme = useTheme();
  const { currencyFormatter, currency } = useSettingsContext();
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    balanceChange,
    percentageChange,
  } = useWalletTotalBalance(wallet.id);

  const walletIconSize = useMemo(() => {
    if (!wallet) return 29;
    return wallet.type === SecretType.LedgerLive ||
      wallet.type === SecretType.Ledger ||
      wallet.type === SecretType.Seedless
      ? 19
      : wallet.type === SecretType.Keystone ||
          wallet.type === SecretType.Keystone3Pro
        ? 17.6
        : 26.5;
  }, [wallet]);

  const placeholderTotalBalance = useMemo(
    () => currencyFormatter(0).replace('0.00', ' -'),
    [currencyFormatter],
  );

  return (
    <Stack gap={1} ml={0.5}>
      <Stack direction="row" alignItems="center" gap={1} color="text.secondary">
        <WalletIcon
          size={walletIconSize}
          type={wallet.type}
          authProvider={wallet.authProvider}
        />
        <Typography variant="h2">{wallet?.name}</Typography>
      </Stack>
      {isLoading && (
        <Stack height={48.5} justifyContent="flex-start">
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h2">{placeholderTotalBalance}</Typography>
            <Typography variant="h7">{currency}</Typography>
            <CircularProgress size={14} />
          </Stack>
        </Stack>
      )}
      {!isLoading && (
        <Stack>
          <Stack direction="row" alignItems="baseline" gap={0.5}>
            <Typography variant="h2">
              {totalBalanceInCurrency !== undefined
                ? currencyFormatter(totalBalanceInCurrency)
                : placeholderTotalBalance}
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
        </Stack>
      )}
    </Stack>
  );
};
