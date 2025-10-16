import { isAvalancheNetwork, isBtcNetwork, isEvmNetwork } from '@core/types';

import { MessageDetailsProps } from '../../types';

import { EvmActionDetails } from './evm/EvmActionDetails';
import { UnknownActionDetails } from './UnknownActionDetails';
import { BtcActionDetails } from './btc';
import { AvalancheTransactionDetails } from './avalanche';

export const MessageDetails = ({
  network,
  action,
  updateAction,
  error,
}: MessageDetailsProps) => {
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
