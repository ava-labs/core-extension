import { PropsWithChildren, useCallback } from 'react';
import { ChevronRightIcon, IconButton } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import { useConfettiContext } from '@/components/Confetti';

import {
  TransactionStatusProvider,
  TransactionStatusCallbackParams,
} from '@core/ui';
import { openNewTab, getExplorerAddressByNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import { useIsOptimisticConfirmationEnabled } from '@core/ui';

export const TransactionStatusProviderWithConfetti = ({
  children,
}: PropsWithChildren) => {
  const { triggerConfetti, stopConfetti } = useConfettiContext();
  const history = useHistory();
  const shouldUseOptimisticConfirmations = useIsOptimisticConfirmationEnabled();

  const handlePending = useCallback(
    async ({ network }: TransactionStatusCallbackParams) => {
      history.replace('/');
      const showSuccessOnPending =
        await shouldUseOptimisticConfirmations(network);

      if (showSuccessOnPending) {
        triggerConfetti();
      }
    },
    [history, triggerConfetti, shouldUseOptimisticConfirmations],
  );

  const handleSuccess = useCallback(
    async ({ network }: TransactionStatusCallbackParams) => {
      const showSuccessOnPending =
        await shouldUseOptimisticConfirmations(network);

      if (!showSuccessOnPending) {
        triggerConfetti();
      }
    },
    [triggerConfetti, shouldUseOptimisticConfirmations],
  );

  return (
    <TransactionStatusProvider
      onPending={handlePending}
      onSuccess={handleSuccess}
      onReverted={stopConfetti}
      renderExplorerLink={({ network, hash }) => (
        <ExplorerLink network={network} hash={hash} />
      )}
    >
      {children}
    </TransactionStatusProvider>
  );
};

const ExplorerLink = ({
  network,
  hash,
}: {
  network: NetworkWithCaipId;
  hash: string;
}) => (
  <IconButton
    data-testid="show-in-explorer-button"
    data-tx-hash={hash}
    size="small"
    sx={{ color: 'background.default', padding: 0 }}
    onClick={() => {
      openNewTab({
        url: getExplorerAddressByNetwork(network, hash, 'tx'),
      });
    }}
  >
    <ChevronRightIcon size={18} />
  </IconButton>
);
