import { PropsWithChildren, useCallback } from 'react';
import { ChevronRightIcon, IconButton } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import { useConfettiContext } from '@/components/Confetti';

import {
  TransactionStatusProvider,
  TransactionStatusCallbackParams,
} from '@core/ui';
import {
  openNewTab,
  getExplorerAddressByNetwork,
  isAvalanchePrimaryNetwork,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';

export const TransactionStatusProviderWithConfetti = ({
  children,
}: PropsWithChildren) => {
  const { triggerConfetti, stopConfetti } = useConfettiContext();
  const history = useHistory();

  const handlePending = useCallback(
    ({ network }: TransactionStatusCallbackParams) => {
      history.replace('/');
      // Trigger confetti on pending for Avalanche C/P/X chains
      if (isAvalanchePrimaryNetwork(network)) {
        triggerConfetti();
      }
    },
    [history, triggerConfetti],
  );

  const handleSuccess = useCallback(
    ({ network }: TransactionStatusCallbackParams) => {
      // Trigger confetti on success for non-Avalanche chains
      if (!isAvalanchePrimaryNetwork(network)) {
        triggerConfetti();
      }
    },
    [triggerConfetti],
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
