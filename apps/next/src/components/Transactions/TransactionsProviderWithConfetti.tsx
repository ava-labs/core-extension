import { PropsWithChildren } from 'react';
import { ChevronRightIcon, IconButton } from '@avalabs/k2-alpine';
import { useConfettiContext } from '@/components/Confetti';

import { TransactionStatusProvider, useNavigation } from '@core/ui';
import { openNewTab } from '@core/common';
import { getExplorerAddressByNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

export const TransactionStatusProviderWithConfetti = ({
  children,
}: PropsWithChildren) => {
  const { triggerConfetti } = useConfettiContext();
  const history = useNavigation('scale');

  return (
    <TransactionStatusProvider
      onPending={() => {
        history.replace('/');
      }}
      onSuccess={() => {
        triggerConfetti();
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
