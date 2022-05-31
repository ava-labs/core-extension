import { BigNumber } from 'ethers';

export interface NetworkFee {
  displayDecimals: number;
  low: BigNumber;
  medium: BigNumber;
  high: BigNumber;
}

export type SerializedNetworkFee = Omit<
  NetworkFee,
  'low' | 'medium' | 'high'
> & {
  low: { type: 'BigNumber'; hex: string };
  medium: { type: 'BigNumber'; hex: string };
  high: { type: 'BigNumber'; hex: string };
};

export enum NetworkFeeEvents {
  NETWORK_FEE_UPDATED = 'network-fee-updated',
}
