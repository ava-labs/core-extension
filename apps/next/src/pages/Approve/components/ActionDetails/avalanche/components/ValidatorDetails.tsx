import { FC } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { AvalancheNetwork } from '@core/types';
import { Action } from '@core/types';
import { DelegatorValidatorDetails } from './DelegatorValidatorDetails';

// Labels to include in validator details
const VALIDATOR_LABELS_TO_INCLUDE = [
  'Node ID',
  'Stake Amount',
  'Delegation Fee',
  'Start Date',
  'End Date',
];

type ValidatorDetailsProps = {
  action: Action<DisplayData>;
  network: AvalancheNetwork;
};

export const ValidatorDetails: FC<ValidatorDetailsProps> = ({
  action,
  network,
}) => {
  return (
    <DelegatorValidatorDetails
      action={action}
      network={network}
      labelsToInclude={VALIDATOR_LABELS_TO_INCLUDE}
    />
  );
};
