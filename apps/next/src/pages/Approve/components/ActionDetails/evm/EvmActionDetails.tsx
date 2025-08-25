import { Typography } from '@avalabs/k2-alpine';

import { EvmNetwork } from '@core/types';

import { ActionDetailsProps } from '../../../types';

type EvmActionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: EvmNetwork;
};

export const EvmActionDetails = (_props: EvmActionDetailsProps) => {
  return (
    <>
      <Typography variant="subtitle3">
        Placeholder for some EVM-specific details
      </Typography>
    </>
  );
};
