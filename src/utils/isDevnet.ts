import { ChainId } from '@avalabs/core-chains-sdk';
import type { Network } from '@src/background/services/network/models';

export const isDevnet = (network: Network) =>
  network.chainId === ChainId.AVALANCHE_DEVNET_P || network.chainId === 43117;
