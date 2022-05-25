import { BigNumber } from 'ethers';

export interface NetworkFee {
  displayDecimals: number;
  low: BigNumber;
  medium: BigNumber;
  high: BigNumber;
}

export enum NetworkFeeEvents {
  NETWORK_FEE_UPDATED = 'network-fee-updated',
}
