import { Network } from '@avalabs/chains-sdk';
import { DomainMetadata } from '@src/background/models';
import {
  TokenWithBalanceERC20,
  NetworkTokenWithBalance,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import {
  EnsureDefined,
  TransactionDisplayValues,
  txParams,
} from '@src/background/services/transactions/models';
import BN from 'bn.js';
import * as ethers from 'ethers';

export type ContractParserHandler = (
  network: Network,
  request: txParams,
  data: any,
  props?: any,
  txDetails?: ethers.utils.TransactionDescription
) => Promise<TransactionDisplayValues>;
export type ContractParser = [ContractCall, ContractParserHandler];

export enum ContractCall {
  APPROVE = 'approve',
  SWAP_EXACT_TOKENS_FOR_TOKENS = 'swapExactTokensForTokens',
  SWAP_TOKENS_FOR_EXACT_TOKENS = 'swapTokensForExactTokens',
  SWAP_AVAX_FOR_EXACT_TOKENS = 'swapAVAXForExactTokens',
  SWAP_EXACT_TOKENS_FOR_AVAX = 'swapExactTokensForAVAX',
  SWAP_EXACT_AVAX_FOR_TOKENS = 'swapExactAVAXForTokens',
  ADD_LIQUIDITY = 'addLiquidity',
  ADD_LIQUIDITY_AVAX = 'addLiquidityAVAX',
  SIMPLE_SWAP = 'simpleSwap',
}

export type BNWithDisplay = { bn: BN; value: string };
export type erc20PathToken = TokenWithBalance & {
  amountIn?: BNWithDisplay;
  amountOut?: BNWithDisplay;
  amountUSDValue?: string;
};
export type SwapTokenIn = EnsureDefined<erc20PathToken, 'amountIn'>;
export type SwapTokenOut = EnsureDefined<erc20PathToken, 'amountOut'>;
export interface SwapExactTokensForTokenDisplayValues
  extends TransactionDisplayValues {
  path: Array<erc20PathToken | SwapTokenIn | SwapTokenOut>;
}
export interface SimpleSwapDisplayValues extends TransactionDisplayValues {
  path: Array<erc20PathToken | SwapTokenIn | SwapTokenOut>;
}

export type LiquidityPoolToken = TokenWithBalance & {
  amountDepositedDisplayValue: string;
  amountUSDValue?: string;
};
export interface AddLiquidityDisplayData extends TransactionDisplayValues {
  poolTokens: LiquidityPoolToken[];
}

export interface ApproveTransactionData extends TransactionDisplayValues {
  tokenToBeApproved: TokenWithBalance;
  network?: Network;
}

type GasPricingData = {
  maxFeePerGas: ethers.BigNumber;
  maxPriorityFeePerGas?: ethers.BigNumber;
  suggestedMaxFeePerGas?: ethers.BigNumber;
  suggestedMaxPriorityFeePerGas?: ethers.BigNumber;
};

export type DisplayValueParserProps = GasPricingData & {
  erc20Tokens: TokenWithBalanceERC20[];
  avaxToken: NetworkTokenWithBalance;
  avaxPrice: number;
  site: DomainMetadata;
};
