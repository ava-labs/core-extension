import { BN } from '@avalabs/avalanche-wallet-sdk';
import { DomainMetadata } from '@src/background/models';
import {
  NetworkContractTokenWithBalance,
  NetworkTokenWithBalance,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import {
  TransactionDisplayValues,
  txParams,
} from '@src/background/services/transactions/models';
import * as ethers from 'ethers';

export type ContractParserHandler = (
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
}

export type BNWithDisplay = { bn: BN; value: string };
export type erc20PathToken = TokenWithBalance & {
  amountIn?: BNWithDisplay;
  amountOut?: BNWithDisplay;
  amountUSDValue?: string;
};
export interface SwapExactTokensForTokenDisplayValues
  extends TransactionDisplayValues {
  path: erc20PathToken[];
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
}

export interface DisplayValueParserProps {
  gasPrice: ethers.BigNumber;
  erc20Tokens: NetworkContractTokenWithBalance[];
  avaxToken: NetworkTokenWithBalance;
  avaxPrice: number;
  site: DomainMetadata;
}
