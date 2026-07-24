import { Network } from '@core/types';

import { isEthereumNetwork } from '../network/isEthereumNetwork';
import { isRobinhoodNetwork } from '../network/isRobinhoodNetwork';

export const isEthereumAppRequired = (network: Network) => {
  return isEthereumNetwork(network) || isRobinhoodNetwork(network);
};
