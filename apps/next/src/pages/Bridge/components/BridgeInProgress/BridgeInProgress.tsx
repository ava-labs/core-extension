import { useBridgeState } from '@/pages/Bridge/contexts';
import { Box, Button } from '@avalabs/k2-alpine';
import { findMatchingBridgeAsset } from '@core/common';
import { useBridgeAmounts } from '@core/ui';
import Big from 'big.js';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BridgeTokenCard } from '../BridgeTokenCard';
import { BridgeDetails, TransactionFailure } from './components';

export const BridgeInProgress: FC = () => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const {
    query: { transactionId },
    state: { pendingTransfers },
    sourceTokens,
  } = useBridgeState();
  const pendingTransfer = pendingTransfers[transactionId];

  const token = useMemo(() => {
    if (!pendingTransfer?.asset) {
      return undefined;
    }
    const assets = [pendingTransfer.asset];
    return sourceTokens.find((srcToken) =>
      findMatchingBridgeAsset(assets, srcToken),
    );
  }, [sourceTokens, pendingTransfer?.asset]);

  const {
    amount = Big(0),
    sourceNetworkFee = Big(0),
    targetNetworkFee = Big(0),
  } = useBridgeAmounts(pendingTransfer);

  if (!pendingTransfer) {
    return null;
  }

  if (pendingTransfer.errorCode) {
    return (
      <TransactionFailure
        token={token}
        amount={amount}
        transfer={pendingTransfer}
      />
    );
  }

  return (
    <>
      <BridgeTokenCard token={token} amount={amount} size={24} badgeSize={10} />
      <BridgeDetails
        networkLabel={t('From')}
        chain={pendingTransfer.sourceChain}
        fee={sourceNetworkFee}
        confirmationsRequired={pendingTransfer.sourceRequiredConfirmationCount}
        confirmationsReceived={pendingTransfer.sourceConfirmationCount}
      />
      <BridgeDetails
        networkLabel={t('To')}
        chain={pendingTransfer.targetChain}
        fee={targetNetworkFee}
        confirmationsRequired={pendingTransfer.targetRequiredConfirmationCount}
        confirmationsReceived={pendingTransfer.targetConfirmationCount}
      />
      <Box mt="auto">
        <Button
          variant="contained"
          size="extension"
          color="primary"
          fullWidth
          onClick={() => push('/')}
        >
          {t('Notify me when it’s done')}
        </Button>
      </Box>
    </>
  );
};
