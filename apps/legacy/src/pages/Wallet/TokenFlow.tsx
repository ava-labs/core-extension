import { MaliciousTokenWarningBox } from '@/components/common/MaliciousTokenWarning';
import { NotSupportedByWallet } from '@/components/common/NotSupportedByWallet';
import { PageTitle } from '@/components/common/PageTitle';
import { PAndL } from '@/components/common/ProfitAndLoss';
import { TokenIcon } from '@/components/common/TokenIcon';
import {
  ArrowUpRightIcon,
  BridgeIcon,
  Button,
  BuyIcon,
  CircularProgress,
  Divider,
  QRCodeIcon,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { TokenType } from '@avalabs/vm-module-types';
import {
  getCoreWebUrl,
  hasUnconfirmedBalance,
  isBitcoinNetwork,
  isPchainNetwork,
  isTokenMalicious,
  isXchainNetwork,
  openNewTab,
} from '@core/common';
import { getUnconfirmedBalanceInCurrency } from '@core/types';
import {
  FunctionNames,
  useAccountsContext,
  useAnalyticsContext,
  useIsFunctionAvailable,
  useLiveBalance,
  useNetworkContext,
  useSetSendDataInParams,
  useSettingsContext,
  useTokenFromParams,
  useTokensWithBalances,
} from '@core/ui';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Activity } from '../Activity/Activity';
import { BTCBalanceBreakdown } from './BTCBalanceBreakdown';
import { TokenBalance } from './TokenFlowBalance';

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
  const { isFunctionAvailable: isBuyAvailable } = useIsFunctionAvailable({
    functionName: FunctionNames.BUY,
  });

  const { isBitcoin, isPchain, isXchain } = useMemo(() => {
    const networkExists = !!network;
    return {
      isBitcoin: networkExists && isBitcoinNetwork(network),
      isPchain: networkExists && isPchainNetwork(network),
      isXchain: networkExists && isXchainNetwork(network),
    };
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
          <Stack
            sx={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            {'unconfirmedBalance' in token ? (
              <Tooltip
                title={<BTCBalanceBreakdown token={token} />}
                placement="bottom"
              >
                <TokenBalance token={token} />
              </Tooltip>
            ) : (
              <TokenBalance token={token} />
            )}
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
