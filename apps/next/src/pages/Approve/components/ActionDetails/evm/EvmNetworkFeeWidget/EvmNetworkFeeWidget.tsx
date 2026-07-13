import { DisplayData } from '@avalabs/vm-module-types';

import { Action, EvmNetwork } from '@core/types';

import { GaslessNetworkFee } from './GaslessNetworkFee';
import { StandardNetworkFee } from './StandardNetworkFee';

type EvmNetworkFeeWidgetProps = {
  action: Action<DisplayData>;
  network: EvmNetwork;
  disableGasless?: boolean;
};

export const EvmNetworkFeeWidget = ({
  action,
  network,
  disableGasless,
}: EvmNetworkFeeWidgetProps) => {
  if (disableGasless) {
    return <StandardNetworkFee action={action} network={network} />;
  }

  return <GaslessNetworkFee action={action} network={network} />;
};
