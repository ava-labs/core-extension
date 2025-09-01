import { DisplayData, RpcMethod, SigningData } from '@avalabs/vm-module-types';

import type { calculateGasAndFees } from '@core/common';
import { Action, BtcNetwork, NativeTokenBalance } from '@core/types';

import { BtcFeePreset } from '../../types';

export type BtcTxSigningData = Extract<
  SigningData,
  {
    type: RpcMethod.BITCOIN_SEND_TRANSACTION;
  }
>;

type ResultBase = {
  fee: ReturnType<typeof calculateGasAndFees>;
  feePreset: BtcFeePreset;
  choosePreset: (preset: BtcFeePreset) => void;
  nativeToken: NativeTokenBalance;
  hasEnoughForNetworkFee: boolean;
};

export type UseBtcTransactionFeeReadyResult = {
  isLoading: false;
} & ResultBase;

export type UseBtcTransactionFeeLoadingResult = {
  isLoading: true;
} & Partial<ResultBase>;

export type UseBtcTransactionFeeArgs = {
  action: Action<DisplayData>;
  network: BtcNetwork;
};

export type UseBtcTransactionFeeResult =
  | UseBtcTransactionFeeReadyResult
  | UseBtcTransactionFeeLoadingResult;

export type UseBtcTransactionFee = (
  args: UseBtcTransactionFeeArgs,
) => UseBtcTransactionFeeResult;
