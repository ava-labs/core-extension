import { BigNumber } from 'ethers';

export interface NetworkFee {
  low: BigNumber;
  medium: BigNumber;
  high: BigNumber;
}

export enum NetworkFeeEvents {
  NETWORK_FEE_UPDATED = 'network-fee-updated',
}
