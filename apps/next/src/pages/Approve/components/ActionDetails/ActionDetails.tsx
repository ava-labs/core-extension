import { isBtcNetwork, isEvmNetwork, isSolanaNetwork } from '@core/types';

import { ActionDetailsProps } from '../../types';

import { EvmActionDetails } from './evm/EvmActionDetails';
import { UnknownActionDetails } from './UnknownActionDetails';
import { BtcActionDetails } from './btc';
import { SolanaActionDetails } from './solana/SolanaActionDetails';

export const ActionDetails = ({
  network,
  action,
  updateAction,
  error,
}: ActionDetailsProps) => {
  if (isEvmNetwork(network)) {
    return (
      <EvmActionDetails
        network={network}
        action={action}
        updateAction={updateAction}
        error={error}
      />
    );
  }

  if (isBtcNetwork(network)) {
    return (
      <BtcActionDetails
        network={network}
        action={action}
        updateAction={updateAction}
        error={error}
      />
    );
  }

  if (isSolanaNetwork(network)) {
    return (
      <SolanaActionDetails
        network={network}
        action={action}
        updateAction={updateAction}
        error={error}
      />
    );
  }

  return (
    <UnknownActionDetails
      network={network}
      action={action}
      updateAction={updateAction}
      error={error}
    />
  );
};
