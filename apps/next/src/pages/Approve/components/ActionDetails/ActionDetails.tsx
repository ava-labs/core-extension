import { isEvmNetwork } from '@core/types';

import { ActionDetailsProps } from '../../types';

import { EvmActionDetails } from './evm/EvmActionDetails';
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

  return (
    <UnknownActionDetails
      network={network}
      action={action}
      updateAction={updateAction}
      error={error}
    />
  );
};
