import { FC } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { AvalancheNetwork, Action } from '@core/types';
import { DelegatorValidatorDetails } from './DelegatorValidatorDetails';

type DelegatorDetailsProps = {
  action: Action<DisplayData>;
  network: AvalancheNetwork;
};

// Labels to keep for delegator transaction details
const DELEGATOR_LABELS_TO_KEEP = [
  'Node ID',
  'Stake Amount',
  'Start Date',
  'End Date',
];

export const DelegatorDetails: FC<DelegatorDetailsProps> = ({
  action,
  network,
}) => {
  return (
    <DelegatorValidatorDetails
      action={action}
      network={network}
      labelsToInclude={DELEGATOR_LABELS_TO_KEEP}
    />
  );
};
