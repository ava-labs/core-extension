import { BtcSigner, EvmSignerWithMessage } from '@avalabs/fusion-sdk';

import {
  Erc20TokenBalance,
  EvmNativeTokenBalance,
  SolanaNativeTokenBalance,
  SolanaSplTokenBalance,
} from '@core/types';

export type SwappableAssetType =
  | 'evm_native'
  | 'evm_erc20'
  | 'svm_native'
  | 'svm_spl';

export type SwappableToken =
  | EvmNativeTokenBalance
  | Erc20TokenBalance
  | SolanaNativeTokenBalance
  | SolanaSplTokenBalance;

export type Signers = {
  evm: EvmSignerWithMessage;
  btc: BtcSigner;
};

export type QuoteStreamingStatus = 'done' | 'loading' | 'error';

export type SwapStatus =
  | 'loading'
  | 'initialized'
  | 'initialization-failed'
  | 'no-swappable-assets'
  | 'no-routes-found'
  | 'ready-to-transfer';

export type EstimatedFeeResult = {
  fee: bigint | undefined;
  isFeeLoading: boolean;
  feeError: Error | null;
};
