import { useBridgeState } from '@/pages/Bridge/contexts';
import { Box, Button } from '@avalabs/k2-alpine';
import { findMatchingBridgeAsset } from '@core/common';
import { useBridgeAmounts } from '@core/ui';
import Big from 'big.js';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BridgeTokenCard } from '../BridgeTokenCard';
import { BridgeDetails } from './components';

export const BridgeInProgress: FC = () => {
  const { t } = useTranslation();
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

  return (
    <>
      <BridgeTokenCard token={token} amount={amount} />
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
        <Button variant="contained" size="extension" color="primary" fullWidth>
          {t('Notify me when it’s done')}
        </Button>
      </Box>
    </>
  );
};
