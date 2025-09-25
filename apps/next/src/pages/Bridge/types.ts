import {
  Erc20TokenBalance,
  EvmNativeTokenBalance,
  SolanaNativeTokenBalance,
  SolanaSplTokenBalance,
} from '@core/types';

export type BridgeableAssetType =
  | 'evm_native'
  | 'evm_erc20'
  | 'svm_native'
  | 'svm_spl';

export type BridgeableToken =
  | EvmNativeTokenBalance
  | Erc20TokenBalance
  | SolanaNativeTokenBalance
  | SolanaSplTokenBalance;

export type BridgeProvider =
  | 'none'
  | 'native-wrapper'
  | 'markr'
  | 'paraswap'
  | 'jupiter'
  | 'unsupported';
