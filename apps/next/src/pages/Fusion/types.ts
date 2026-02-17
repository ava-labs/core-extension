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
