import { NetworkFees } from '@avalabs/vm-module-types';

export type FeeRate = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas?: bigint;
};

export interface NetworkFee {
  displayDecimals: number;
  baseFee?: bigint;
  low: FeeRate;
  medium: FeeRate;
  high: FeeRate;
  isFixedFee: boolean;
}

export type TransactionPriority = Extract<
  keyof NetworkFees,
  'low' | 'medium' | 'high'
>;

export type SerializedNetworkFee = Omit<
  NetworkFee,
  'low' | 'medium' | 'high'
> & {
  low: bigint;
  medium: bigint;
  high: bigint;
  isFixedFee: boolean;
};
