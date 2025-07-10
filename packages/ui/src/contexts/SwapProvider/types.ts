import { SwapSide } from '@paraswap/sdk';
import { SwapQuote, SwapWalletState } from './models';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import type WAVAX_ABI from './ABI_WAVAX.json';
import type WETH_ABI from './ABI_WETH.json';
import { TransactionParams } from '@avalabs/evm-module';
import { RpcMethod } from '@avalabs/vm-module-types';
import { SupportedProvider } from '@core/common';

export function isEvmProvider(
  provider: SupportedProvider,
): provider is JsonRpcBatchInternal {
  return provider instanceof JsonRpcBatchInternal;
}

export enum EvmSwapOperation {
  WRAP = 'WRAP',
  UNWRAP = 'UNWRAP',
}

export type EvmWrapQuote = {
  operation: EvmSwapOperation.WRAP;
  target: string;
  amount: string;
};

export type EvmUnwrapQuote = {
  operation: EvmSwapOperation.UNWRAP;
  source: string;
  amount: string;
};

export type NormalizedSwapQuote = {
  quote: SwapQuote;
  metadata: Record<string, unknown>;
};

export type NormalizedSwapQuoteResult = {
  provider: string;
  quotes: NormalizedSwapQuote[];
  selected: NormalizedSwapQuote;
};

export type GetQuoteParams = {
  amount: string;
  fromTokenAddress: string;
  fromTokenDecimals?: number;
  fromTokenBalance?: bigint;
  toTokenAddress: string;
  toTokenDecimals?: number;
  destination: SwapSide;
  slippage: number;
  onUpdate?: (update: NormalizedSwapQuoteResult) => void;
  isSwapFeesEnabled?: boolean;
};

export type WrapUnwrapTxParams = {
  userAddress: string;
  tokenAddress: string;
  amount: string;
  provider: JsonRpcBatchInternal;
  abi: typeof WAVAX_ABI | typeof WETH_ABI;
};

export type SolanaTransactionParams = {
  account: string;
  serializedTx: string;
};

export type NormalizedTransactionParams =
  | TransactionParams
  | SolanaTransactionParams;

export type PerformSwapParams = {
  srcTokenAddress: string | undefined;
  isSrcTokenNative?: boolean;
  srcTokenDecimals?: number;
  destTokenAddress: string | undefined;
  isDestTokenNative?: boolean;
  destTokenDecimals?: number;
  quote: SwapQuote;
  slippage?: number;
  provider: SupportedProvider;
  userAddress: string | undefined;
  signAndSend: (
    method: RpcMethod,
    txParams: [NormalizedTransactionParams],
    context?: Record<string, unknown>,
  ) => Promise<string>;
  isSwapFeesEnabled: boolean;
  feeAccount?: string;
  isOneClickSwapEnabled: boolean;
};

export function isEvmWrapQuote(quote: SwapQuote): quote is EvmWrapQuote {
  return 'operation' in quote && quote.operation === EvmSwapOperation.WRAP;
}

export function isEvmUnwrapQuote(quote: SwapQuote): quote is EvmUnwrapQuote {
  return 'operation' in quote && quote.operation === EvmSwapOperation.UNWRAP;
}

export interface SwapProvider {
  name: string;
  getQuote: (
    params: GetQuoteParams & SwapWalletState,
    abortSignal?: AbortSignal,
  ) => Promise<NormalizedSwapQuoteResult | undefined>;
  swap: (params: PerformSwapParams & SwapWalletState) => Promise<string>;
}
