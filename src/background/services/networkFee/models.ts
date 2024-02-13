export type FeeRate = {
  maxFee: bigint;
  maxTip?: bigint;
};

export interface NetworkFee {
  displayDecimals: number;
  baseMaxFee?: bigint;
  low: FeeRate;
  medium: FeeRate;
  high: FeeRate;
  isFixedFee: boolean;
}

export type TransactionPriority = 'low' | 'medium' | 'high';

export type SerializedNetworkFee = Omit<
  NetworkFee,
  'low' | 'medium' | 'high'
> & {
  low: bigint;
  medium: bigint;
  high: bigint;
  isFixedFee: boolean;
};

export enum NetworkFeeEvents {
  NETWORK_FEE_UPDATED = 'network-fee-updated',
}
