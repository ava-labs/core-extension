import { FUJI_NETWORK } from '@src/background/services/network/models';

export function getEtherscanLink(network) {
  if (network.name === FUJI_NETWORK.name) {
    return 'https://rinkeby.etherscan.io';
  }

  return 'https://etherscan.io';
}
