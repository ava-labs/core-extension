import { MaliciousTokenWarningBox } from '@/components/common/MaliciousTokenWarning';
import { NotSupportedByWallet } from '@/components/common/NotSupportedByWallet';
import { PageTitle } from '@/components/common/PageTitle';
import { PAndL } from '@/components/common/ProfitAndLoss';
import { TokenIcon } from '@/components/common/TokenIcon';
import { useAccountsContext } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { useSettingsContext } from '@core/ui';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { useLiveBalance } from '@core/ui';
import { useSetSendDataInParams } from '@core/ui';
import { useTokenFromParams } from '@core/ui';
import { useTokensWithBalances } from '@core/ui';
import {
  ArrowUpRightIcon,
  BridgeIcon,
  Button,
  BuyIcon,
  CircularProgress,
  Divider,
  QRCodeIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenType } from '@avalabs/vm-module-types';
import { getUnconfirmedBalanceInCurrency } from '@core/types';
import {
  getCoreWebUrl,
  hasUnconfirmedBalance,
  isBitcoinNetwork,
  isPchainNetwork,
  isTokenMalicious,
  isXchainNetwork,
  openNewTab,
} from '@core/common';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Activity } from '../Activity/Activity';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export function TokenFlow() {
  const { t } = useTranslation();
  const history = useHistory();
  const { currencyFormatter } = useSettingsContext();
  const token = useTokenFromParams();
  const tokensWithBalances = useTokensWithBalances();
  const { capture } = useAnalyticsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const [tokensWithBalancesAreReady, setTokensWithBalancesAreReady] =
    useState<boolean>();
  const [showSend, setShowSend] = useState<boolean>();
  const setSendDataInParams = useSetSendDataInParams();
  const { network } = useNetworkContext();
  const { isFunctionAvailable: isBuyAvailable } = useIsFunctionAvailable(
    FunctionNames.BUY,
  );

  const isBitcoin = useMemo(() => {
    if (!network) return false;
    return isBitcoinNetwork(network);
  }, [network]);

  const isPchain = useMemo(() => {
    if (!network) return false;
    return isPchainNetwork(network);
  }, [network]);

  const isXchain = useMemo(() => {
    if (!network) return false;
    return isXchainNetwork(network);
  }, [network]);

  const hasAccessToActiveNetwork = useMemo(() => {
    if (isPchain && activeAccount && !activeAccount.addressPVM) {
      return false;
    }

    if (isXchain && activeAccount && !activeAccount.addressAVM) {
      return false;
    }
    return true;
  }, [isPchain, activeAccount, isXchain]);

  useEffect(() => {
    setShowSend(token && token.balance > 0n);
  }, [token]);

  useEffect(() => {
    if (!hasAccessToActiveNetwork) {
      setTokensWithBalancesAreReady(true);
    } else {
      setTokensWithBalancesAreReady(!!tokensWithBalances.length);
    }
  }, [activeAccount, hasAccessToActiveNetwork, tokensWithBalances]);

  useLiveBalance(POLLED_BALANCES);

  if (!hasAccessToActiveNetwork) {
    return (
      <NotSupportedByWallet
        functionName={FunctionNames.TOKEN_DETAILS}
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  if (!token || tokensWithBalancesAreReady === undefined) {
    return <CircularProgress />;
  }

  const balanceCurrencyValue =
    isBitcoin && hasUnconfirmedBalance(token)
      ? (token.balanceInCurrency ?? 0) +
        (getUnconfirmedBalanceInCurrency(token) ?? 0)
      : token.balanceInCurrency;

  const totalBalance =
    token.balance && hasUnconfirmedBalance(token)
      ? new TokenUnit(
          token.balance + token.unconfirmedBalance,
          token.decimals,
          token.symbol,
        )
      : new TokenUnit(
          token.balance,
          'decimals' in token ? token.decimals : 0,
          token.symbol,
        );

  return (
    <Stack sx={{ width: '100%', position: 'relative' }}>
      <PageTitle
        onBackClick={() => {
          if (isBitcoin || isPchain || isXchain) {
            history.replace('/home');
            return;
          }

          history.replace('/assets');
        }}
      >
        {t('Token Details')}
      </PageTitle>
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ width: '100%', py: 2, px: 2 }}
      >
        <TokenIcon
          height={'40px'}
          width={'40px'}
          src={token.logoUri}
          name={token.name}
        />
        <Stack sx={{ flex: 1, ml: 2, rowGap: '2px' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography data-testid="token-details-name" variant="h5">
              {token.name}
            </Typography>
            <Typography
              data-testid="token-details-currency-balance"
              variant="h6"
            >
              {balanceCurrencyValue
                ? currencyFormatter(Number(balanceCurrencyValue))
                : currencyFormatter(0)}
            </Typography>
          </Stack>
          <Stack sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Stack direction="row" alignItems="center" sx={{ columnGap: 0.5 }}>
              <Typography data-testid="token-details-balance" variant="body2">
                {totalBalance.toDisplay()}{' '}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {token.symbol}
              </Typography>
            </Stack>
            <PAndL
              value={token.priceChanges?.value}
              percentage={token.priceChanges?.percentage}
              showPercentage
            />
          </Stack>
        </Stack>
      </Stack>
      {isTokenMalicious(token) && (
        <MaliciousTokenWarningBox sx={{ mb: 1, mx: 2 }} />
      )}
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ mb: 3, mt: 1, mx: 2, columnGap: 1 }}
      >
        {!showSend && isBuyAvailable ? (
          <Button
            data-testid="token-details-send-button"
            color="secondary"
            onClick={() => {
              openNewTab({ url: `${getCoreWebUrl()}/buy` });
            }}
            fullWidth
          >
            <BuyIcon size={20} sx={{ mr: 1 }} />
            {t('Buy')}
          </Button>
        ) : (
          <Button
            data-testid="token-details-send-button"
            color="secondary"
            onClick={() => {
              capture('TokenSendClicked', { chainId: network?.chainId });
              setSendDataInParams({ token, options: { path: '/send' } });
            }}
            fullWidth
          >
            <ArrowUpRightIcon size={20} sx={{ mr: 1 }} />
            {t('Send')}
          </Button>
        )}

        <Button
          data-testid="token-details-receive-button"
          color="secondary"
          onClick={() => {
            capture('TokenReceiveClicked', { chainId: network?.chainId });
            history.push('/receive');
          }}
          fullWidth
        >
          <QRCodeIcon size={20} sx={{ mr: 1 }} />
          {t('Receive')}
        </Button>
        {isBitcoin && (
          <Button
            data-testid="token-details-bridge-button"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              history.push('/bridge');
            }}
            fullWidth
          >
            <BridgeIcon size={22} sx={{ mr: 1 }} />
            {t('Bridge')}
          </Button>
        )}
      </Stack>
      <Divider sx={{ mb: 1 }} />
      <Stack sx={{ flexGrow: 1, px: 2, mb: 2 }}>
        <Activity tokenSymbolFilter={token.symbol} isEmbedded />
      </Stack>
    </Stack>
  );
}
