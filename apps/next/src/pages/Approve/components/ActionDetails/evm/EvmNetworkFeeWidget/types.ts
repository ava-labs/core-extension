import { FeeRate, TransactionPriority } from '@core/types';

export type EvmFeePreset = TransactionPriority | 'custom';

export type EvmGasSettings = FeeRate & {
  gasLimit?: number;
};
