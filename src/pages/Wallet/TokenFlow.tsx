import { PageTitle } from '@src/components/common/PageTitle';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Activity } from '../Activity/Activity';
import { useTranslation } from 'react-i18next';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { balanceToDisplayValue } from '@avalabs/utils-sdk';
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
} from '@avalabs/k2-components';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import BN from 'bn.js';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { openNewTab } from '@src/utils/extensionUtils';
import { getCoreWebUrl } from '@src/utils/getCoreWebUrl';

export function TokenFlow() {
  const { t } = useTranslation();
  const history = useHistory();
  const { currencyFormatter } = useSettingsContext();
  const token = useTokenFromParams();
  const tokensWithBalances = useTokensWithBalances();
  const { capture } = useAnalyticsContext();
  const [tokensWithBalancesAreReady, setTokensWithBalancesAreReady] =
    useState<boolean>();
  const [showSend, setShowSend] = useState<boolean>();
  const setSendDataInParams = useSetSendDataInParams();
  const { network } = useNetworkContext();
  const { isFunctionAvailable: isBuyAvailable } = useIsFunctionAvailable(
    FunctionNames.BUY
  );

  const isBitcoin = useMemo(() => {
    if (!network) return false;
    return isBitcoinNetwork(network);
  }, [network]);

  useEffect(() => {
    setShowSend(token?.balance.gt(new BN(0)));
  }, [token]);

  useEffect(() => {
    setTokensWithBalancesAreReady(!!tokensWithBalances.length);
  }, [tokensWithBalances]);

  if (!token || tokensWithBalancesAreReady === undefined) {
    return <CircularProgress />;
  }

  const balanceCurrencyValue = isBitcoin
    ? (token.balanceUSD || 0) + (token.unconfirmedBalanceUSD || 0)
    : token.balanceUsdDisplayValue ?? token.balanceUSD;

  return (
    <Stack sx={{ width: '100%', position: 'relative' }}>
      <PageTitle
        onBackClick={() => {
          isBitcoin ? history.replace('/home') : history.replace('/assets');
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
              variant="body2"
            >
              {balanceCurrencyValue
                ? currencyFormatter(Number(balanceCurrencyValue))
                : currencyFormatter(0)}
            </Typography>
          </Stack>

          <Typography
            data-testid="token-details-balance"
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {token.balance && token.unconfirmedBalance
              ? balanceToDisplayValue(
                  token.balance.add(token.unconfirmedBalance),
                  token.decimals
                )
              : token.balanceDisplayValue || '0.00'}{' '}
            {token.symbol}
          </Typography>
        </Stack>
      </Stack>
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
