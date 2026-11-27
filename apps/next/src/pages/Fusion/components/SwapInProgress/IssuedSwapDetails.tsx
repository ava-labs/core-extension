import { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Collapse, Stack } from '@avalabs/k2-alpine';
import { FailedTransfer, Transfer } from '@avalabs/fusion-sdk';

import {
  isCompletedTransfer,
  isConcludedTransfer,
  isFailedTransfer,
} from '@core/types';
import { useTransferTrackingContext } from '@core/ui';

import { useConfettiContext } from '@/components/Confetti';

import { SwapEstimatedTimeWarning } from '../SwapEstimatedTimeWarning';
import { useSwappedTokens } from './hooks';
import { TransactionFailure, ChainStatusInfoBox } from './components';
import { SwappedTokenRows } from './components/SwappedTokenRows';

type Props = {
  transfer: Transfer;
  isRead: boolean;
};

export const IssuedSwapDetails: FC<Props> = ({ transfer, isRead }) => {
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { triggerConfetti } = useConfettiContext();
  const { markAsRead } = useTransferTrackingContext();

  const hasError = isFailedTransfer(transfer);
  const isComplete = isCompletedTransfer(transfer);
  const isConcluded = isConcludedTransfer(transfer);

  useEffect(() => {
    if (isRead) {
      return;
    }

    if (isComplete) {
      triggerConfetti();
    }

    if (isConcluded) {
      markAsRead(transfer.id);
    }
  }, [
    isComplete,
    isConcluded,
    triggerConfetti,
    markAsRead,
    transfer.id,
    isRead,
  ]);

  const { tokens: swappedTokens, isPending: isLoadingTokens } =
    useSwappedTokens(transfer);

  return (
    <Stack
      width="100%"
      gap={3}
      flexGrow={1}
      justifyContent="space-between"
      data-testid="fusion-cross-chain-progress-page"
    >
      <Stack gap={1}>
        <SwappedTokenRows tokens={swappedTokens} isPending={isLoadingTokens} />

        <SwapEstimatedTimeWarning serviceType={transfer.type} />

        <ChainStatusInfoBox transfer={transfer} side="source" />
        <ChainStatusInfoBox transfer={transfer} side="target" />
        <Collapse in={hasError}>
          <TransactionFailure code={(transfer as FailedTransfer).errorCode} />
        </Collapse>
      </Stack>

      <Stack mt="auto" gap={1}>
        <Button
          variant="contained"
          size="extension"
          color="primary"
          fullWidth
          onClick={goBack}
          data-testid={
            isConcluded
              ? 'fusion-cross-chain-close-button'
              : 'fusion-cross-chain-notify-button'
          }
        >
          {isConcluded ? t('Close') : t('Notify me when it’s done')}
        </Button>
      </Stack>
    </Stack>
  );
};
