import { ChainId } from '@avalabs/core-chains-sdk';
import { Network } from '@src/background/services/network/models';

export const isDevnet = (network: Network) =>
  network.chainId === ChainId.AVALANCHE_DEVNET_P || network.chainId === 43117;
