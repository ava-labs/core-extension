import { Network } from '@core/types';

export const ROBINHOOD_MAINNET_CHAIN_ID = 4663;
export const ROBINHOOD_TESTNET_CHAIN_ID = 46630;

export const isRobinhoodChainId = (chainId: number) => {
  return (
    chainId === ROBINHOOD_MAINNET_CHAIN_ID ||
    chainId === ROBINHOOD_TESTNET_CHAIN_ID
  );
};

export const isRobinhoodNetwork = (network?: Network) => {
  if (!network) {
    return false;
  }

  return isRobinhoodChainId(network.chainId);
};
