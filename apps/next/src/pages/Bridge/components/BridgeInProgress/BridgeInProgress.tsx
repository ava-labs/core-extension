import { useBridgeState } from '@/pages/Bridge/contexts';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { Box, Button, Collapse } from '@avalabs/k2-alpine';
import { findMatchingBridgeAsset } from '@core/common';
import { useBridgeAmounts } from '@core/ui';
import Big from 'big.js';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BridgeTokenCard } from '../BridgeTokenCard';
import { BridgeDetails, TransactionFailure } from './components';

type Props = {
  transfer: BridgeTransfer;
};

export const BridgeInProgress: FC<Props> = ({ transfer: pendingTransfer }) => {
  const { t } = useTranslation();
  const { push, goBack } = useHistory();
  const { sourceTokens } = useBridgeState();

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

  const hasError = Boolean(pendingTransfer.errorCode);
  const isComplete = Boolean(pendingTransfer.completedAt);

  return (
    <>
      <Collapse in={hasError}>
        <TransactionFailure code={pendingTransfer.errorCode} />
      </Collapse>
      <BridgeTokenCard token={token} amount={amount} size={24} badgeSize={10} />
      <BridgeDetails
        networkLabel={t('From')}
        chain={pendingTransfer.sourceChain}
        fee={sourceNetworkFee}
        confirmationsRequired={pendingTransfer.sourceRequiredConfirmationCount}
        confirmationsReceived={pendingTransfer.sourceConfirmationCount}
        error={hasError}
      />
      <BridgeDetails
        networkLabel={t('To')}
        chain={pendingTransfer.targetChain}
        fee={targetNetworkFee}
        confirmationsRequired={pendingTransfer.targetRequiredConfirmationCount}
        confirmationsReceived={pendingTransfer.targetConfirmationCount}
        error={hasError}
      />

      <Box mt="auto">
        <Button
          variant="contained"
          size="extension"
          color="primary"
          fullWidth
          onClick={isComplete ? goBack : () => push('/')}
        >
          {isComplete ? t('Close') : t('Notify me when it’s done')}
        </Button>
      </Box>
    </>
  );
};
