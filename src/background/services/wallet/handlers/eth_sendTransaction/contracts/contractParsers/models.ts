import { Network } from '@avalabs/core-chains-sdk';
import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { Result, TransactionDescription } from 'ethers';

export type ContractParserHandler<ParsedData = Result | undefined> = (
  network: Network,
  request: EthSendTransactionParamsWithGas,
  data: ParsedData,
  txDetails: TransactionDescription | null
) => Promise<TransactionDisplayValues>;
export type ContractParser<T> = [ContractCall, ContractParserHandler<T>];

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
