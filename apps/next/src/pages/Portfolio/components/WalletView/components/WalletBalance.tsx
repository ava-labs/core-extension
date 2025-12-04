import { WalletIcon } from '@/components/WalletIcon';
import {
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { BalanceChange } from '../../BalanceChange';
import { MdError, MdUnfoldMore } from 'react-icons/md';
import { Trans } from 'react-i18next';
import { SecretType, SeedlessAuthProvider } from '@core/types';
import { useMemo } from 'react';
import { useSettingsContext } from '@core/ui';
import { ClickableStack } from '../../PortfolioHome/components/AccountInfo/styled';
import { useHistory } from 'react-router-dom';
import { useWalletIconSize } from '@/hooks/useWalletIconSize';

type Props = {
  walletType?: SecretType;
  walletAuthProvider?: SeedlessAuthProvider;
  walletName?: string;
  isLoading: boolean;
  hasErrorOccurred: boolean;
  totalBalanceInCurrency?: number;
  balanceChange?: number;
  percentageChange?: number;
};
export const WalletBalance = ({
  walletType,
  walletAuthProvider,
  walletName,
  isLoading,
  hasErrorOccurred,
  totalBalanceInCurrency,
  balanceChange,
  percentageChange,
}: Props) => {
  const theme = useTheme();
  const history = useHistory();
  const { currencyFormatter, currency } = useSettingsContext();

  const walletIconSize = useWalletIconSize(walletType, 'walletView');

  const placeholderTotalBalance = useMemo(
    () => currencyFormatter(0).replace('0.00', ' -'),
    [currencyFormatter],
  );

  const balanceToDisplay = useMemo(() => {
    return isLoading
      ? placeholderTotalBalance
      : totalBalanceInCurrency !== undefined
        ? currencyFormatter(totalBalanceInCurrency)
        : placeholderTotalBalance;
  }, [
    isLoading,
    totalBalanceInCurrency,
    placeholderTotalBalance,
    currencyFormatter,
  ]);

  return (
    <Stack mb={1}>
      <ClickableStack
        onClick={() => {
          history.push('/account-management');
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          color="text.secondary"
        >
          <WalletIcon
            size={walletIconSize}
            type={walletType}
            authProvider={walletAuthProvider}
          />

          <Typography variant="h2">{walletName}</Typography>
          <MdUnfoldMore size={16} color={theme.palette.text.secondary} />
        </Stack>
        <Stack direction="row" alignItems="baseline" gap={0.5} ml={0.5}>
          <Typography variant="h2">{balanceToDisplay}</Typography>
          <Typography variant="h7">{currency}</Typography>
          {isLoading && (
            <CircularProgress size={14} sx={{ margin: '0 0 0 8px' }} />
          )}
        </Stack>
      </ClickableStack>

      {!isLoading && (
        <BalanceChange
          balanceChange={balanceChange}
          percentageChange={percentageChange}
        />
      )}

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
  );
};
