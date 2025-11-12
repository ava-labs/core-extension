import {
  isAvalancheNetwork,
  isBtcNetwork,
  isEvmNetwork,
  isSolanaNetwork,
} from '@core/types';

import { ActionDetailsProps } from '../../types';

import { AvalancheTransactionDetails } from './avalanche';
import { BtcActionDetails } from './btc';
import { EvmActionDetails } from './evm/EvmActionDetails';
import { SolanaActionDetails } from './solana/SolanaActionDetails';
import { UnknownActionDetails } from './UnknownActionDetails';

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

  if (isAvalancheNetwork(network)) {
    return (
      <AvalancheTransactionDetails
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
