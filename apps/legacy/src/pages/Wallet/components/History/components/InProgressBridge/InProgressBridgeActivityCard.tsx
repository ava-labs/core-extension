import { useBridgeContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { useUnifiedBridgeContext } from '@core/ui';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { BridgeTransaction, useBridgeSDK } from '@avalabs/core-bridge-sdk';
import {
  Button,
  Card,
  Divider,
  ExternalLinkIcon,
  Stack,
  toast,
  ToastCard,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import {
  bigintToBig,
  blockchainToNetwork,
  getExplorerAddressByNetwork,
  isUnifiedBridgeTransfer,
  networkToBlockchain,
} from '@core/common';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useBlockchainNames } from '../../useBlockchainNames';
import { InProgressBridgeIcon } from './InProgressBridgeIcon';

export interface InProgressBridgeActivityCardProp {
  tx: BridgeTransaction | BridgeTransfer;
}

export function InProgressBridgeActivityCard({
  tx,
}: InProgressBridgeActivityCardProp) {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { networks } = useNetworkContext();
  const { bridgeConfig } = useBridgeSDK();

  const { sourceBlockchain, targetBlockchain } = useBlockchainNames(tx);
  const [toastShown, setToastShown] = useState<boolean>(false);

  const { removeBridgeTransaction } = useBridgeContext();
  const { getErrorMessage } = useUnifiedBridgeContext();

  const explorerUrl = useMemo(() => {
    const networkData = blockchainToNetwork(
      tx.sourceChain,
      networks,
      bridgeConfig,
    );
    if (networkData) {
      return getExplorerAddressByNetwork(networkData, tx.sourceTxHash);
    }
    return undefined;
  }, [tx.sourceChain, tx.sourceTxHash, networks, bridgeConfig]);

  const inProgressValue = useMemo(() => {
    if (!tx) {
      return 0;
    }

    if (isUnifiedBridgeTransfer(tx)) {
      const totalConfirmationsRequired =
        tx.sourceRequiredConfirmationCount + tx.targetRequiredConfirmationCount;
      const totalConfirmationsObtained =
        tx.sourceConfirmationCount + tx.targetConfirmationCount;

      return Math.min(
        100,
        (totalConfirmationsObtained / totalConfirmationsRequired) * 100,
      );
    }

    const confirmationCount = tx.requiredConfirmationCount + 1; // 1 is added for target network

    const currentCount =
      tx.confirmationCount > tx.requiredConfirmationCount
        ? tx.requiredConfirmationCount
        : tx.confirmationCount;

    return (currentCount / confirmationCount) * 100;
  }, [tx]);

  const symbol = useMemo(
    () => (isUnifiedBridgeTransfer(tx) ? tx.asset.symbol : tx?.symbol),
    [tx],
  );
  const amount = useMemo(() => {
    if (isUnifiedBridgeTransfer(tx)) {
      return bigintToBig(tx.amount, tx.asset.decimals);
    }

    return tx.amount;
  }, [tx]);

  useEffect(() => {
    if (!tx.completedAt) {
      return;
    }

    if (!toastShown) {
      setToastShown(true);

      const isSuccessful = !isUnifiedBridgeTransfer(tx) || !tx.errorCode;

      const toastId = toast.custom(
        <ToastCard
          variant={isSuccessful ? 'success' : 'error'}
          title={isSuccessful ? t('Bridge Successful') : t('Bridge Failed')}
          onDismiss={() => {
            toast.remove(toastId);
          }}
        >
          {isSuccessful
            ? t(`You transferred {{amount}} {{symbol}}`, {
                amount,
                symbol,
              })
            : tx.errorCode
              ? getErrorMessage(tx.errorCode)
              : ''}
        </ToastCard>,
        {
          duration: Infinity,
        },
      );
    }

    removeBridgeTransaction(tx.sourceTxHash);
  }, [
    removeBridgeTransaction,
    t,
    toastShown,
    tx,
    amount,
    getErrorMessage,
    symbol,
  ]);

  const errorCode = isUnifiedBridgeTransfer(tx) ? tx.errorCode : undefined;
  const hasError = typeof errorCode !== 'undefined';

  return (
    <Card
      sx={{
        p: 2,
      }}
    >
      <Stack
        divider={
          <Divider
            orientation="vertical"
            flexItem
            style={{
              borderBottomWidth: 1,
            }}
          />
        }
        sx={{ rowGap: 1.5, width: '100%' }}
      >
        <Stack
          sx={{
            cursor: 'pointer',
          }}
        >
          <Stack>
            <Stack
              sx={{
                flexDirection: 'row',
                columnGap: 2,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <InProgressBridgeIcon
                value={inProgressValue}
                hasError={hasError}
              />
              <Stack>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: theme.spacing(32),
                  }}
                >
                  <Typography variant="h6">{t('Bridge')}</Typography>
                  <Stack sx={{ flexDirection: 'row', columnGap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'fontWeightSemibold' }}
                    >
                      {amount.toString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.primary.dark }}
                    >
                      {symbol}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.primary.dark }}
                  >
                    {sourceBlockchain} -&gt; {targetBlockchain}
                  </Typography>

                  <Button
                    variant="text"
                    disableRipple
                    sx={{
                      p: 0,
                    }}
                    onClick={() => {
                      const chainName =
                        typeof tx.sourceChain === 'string'
                          ? tx.sourceChain
                          : networkToBlockchain(tx.sourceChain);

                      history.push(
                        `/bridge/transaction-status/${chainName}/${tx.sourceTxHash}/${tx.sourceStartedAt}`,
                      );
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 'fontWeightSemibold' }}
                    >
                      {t('View Status')}
                    </Typography>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        {!hasError && (
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography>{t('Network Fee')}</Typography>
            <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
              <Typography>{t('Pending')}</Typography>
              {explorerUrl && (
                <ExternalLinkIcon
                  size={16}
                  sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                  onClick={() => {
                    window.open(explorerUrl, '_blank', 'noreferrer');
                  }}
                />
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
