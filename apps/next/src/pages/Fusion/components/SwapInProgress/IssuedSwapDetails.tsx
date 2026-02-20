import { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Collapse, Stack } from '@avalabs/k2-alpine';
import { FailedTransfer, Transfer } from '@avalabs/unified-asset-transfer';

import { isCompletedTransfer, isFailedTransfer } from '@core/types';

import { Card } from '@/components/Card';
import { useConfettiContext } from '@/components/Confetti';

import { SwapEstimatedTimeWarning } from '../SwapEstimatedTimeWarning';
import { useSwappedTokens } from './hooks';
import {
  TokemAmountInfoBox,
  TransactionFailure,
  Styled,
  ChainStatusInfoBox,
} from './components';

type Props = {
  transfer: Transfer;
};

export const IssuedSwapDetails: FC<Props> = ({ transfer }) => {
  const { t } = useTranslation();
  const { push, goBack } = useHistory();
  const { triggerConfetti } = useConfettiContext();

  const hasError = isFailedTransfer(transfer);
  const isComplete = isCompletedTransfer(transfer);

  useEffect(() => {
    if (isCompletedTransfer(transfer)) {
      triggerConfetti();
    }
  }, [transfer, triggerConfetti]);

  const swappedTokens = useSwappedTokens(transfer);

  return (
    <Stack width="100%" gap={3} flexGrow={1} justifyContent="space-between">
      <Stack gap={1}>
        <Card noPadding>
          <Stack divider={<Styled.Divider />}>
            {swappedTokens.map(({ token, amount, tokenId, type }) => (
              <TokemAmountInfoBox
                key={tokenId}
                token={token}
                amount={type === 'paid' ? -amount : amount}
                size={24}
                badgeSize={14}
              />
            ))}
          </Stack>
        </Card>

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
          onClick={isComplete ? goBack : () => push('/')}
        >
          {isComplete ? t('Close') : t('Notify me when it’s done')}
        </Button>
      </Stack>
    </Stack>
  );
};
