import Big from 'big.js';
import { BigNumber } from 'ethers';

export type FeeRate = {
  maxFee: BigNumber;
  maxTip?: BigNumber;
};

export interface NetworkFee {
  displayDecimals: number;
  baseFee?: BigNumber;
  low: FeeRate;
  medium: FeeRate;
  high: FeeRate;
  isFixedFee: boolean;
}

export type EIP1559GasModifier = {
  baseFeeMultiplier: Big;
};

export type TransactionPriority = 'low' | 'medium' | 'high';

export type SerializedNetworkFee = Omit<
  NetworkFee,
  'low' | 'medium' | 'high'
> & {
  low: { type: 'BigNumber'; hex: string };
  medium: { type: 'BigNumber'; hex: string };
  high: { type: 'BigNumber'; hex: string };
  isFixedFee: boolean;
};

export enum NetworkFeeEvents {
  NETWORK_FEE_UPDATED = 'network-fee-updated',
}
