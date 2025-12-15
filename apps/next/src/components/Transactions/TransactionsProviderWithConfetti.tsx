import { PropsWithChildren } from 'react';
import { ChevronRightIcon, IconButton, toast } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import { useConfettiContext } from '@/components/Confetti';

import { TransactionStatusProvider } from '@core/ui';
import { openNewTab } from '@core/common';
import { getExplorerAddressByNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

export const TransactionStatusProviderWithConfetti = ({
  children,
}: PropsWithChildren) => {
  const { triggerConfetti } = useConfettiContext();
  const history = useHistory();

  return (
    <TransactionStatusProvider
      toast={toast}
      onSuccess={() => {
        triggerConfetti();
        history.replace('/');
      }}
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
