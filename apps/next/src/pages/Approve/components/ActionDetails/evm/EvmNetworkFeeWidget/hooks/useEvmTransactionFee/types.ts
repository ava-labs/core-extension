import { DisplayData, RpcMethod, SigningData } from '@avalabs/vm-module-types';

import type { calculateGasAndFees } from '@core/common';
import { Action, EvmNetwork, FeeRate, NativeTokenBalance } from '@core/types';
import { EvmFeePreset } from '../../types';

export type EvmTxSigningData = Extract<
  SigningData,
  { type: RpcMethod.ETH_SEND_TRANSACTION }
>;

type ResultBase = {
  feePreset: EvmFeePreset;
  presets: Record<EvmFeePreset, FeeRate | undefined>;
  gasLimit: number;
  choosePreset: (preset: EvmFeePreset, feeRate?: FeeRate) => void;
  customPreset: FeeRate;
  setCustomPreset: (preset: FeeRate) => void;
  nativeToken: NativeTokenBalance;
  fee: ReturnType<typeof calculateGasAndFees>;
  feeDecimals: number;
  hasEnoughForNetworkFee: boolean;
};

export type UseEvmTransactionFeeReadyResult = {
  isLoading: false;
} & ResultBase;

export type UseEvmTransactionFeeLoadingResult = {
  isLoading: true;
} & Partial<ResultBase>;

export type UseEvmTransactionFeeArgs = {
  action: Action<DisplayData>;
  network: EvmNetwork;
};

export type UseEvmTransactionFeeResult =
  | UseEvmTransactionFeeReadyResult
  | UseEvmTransactionFeeLoadingResult;

export type UseEvmTransactionFee = (
  args: UseEvmTransactionFeeArgs,
) => UseEvmTransactionFeeResult;
