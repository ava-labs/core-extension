import { BN } from '@avalabs/avalanche-wallet-sdk';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import {
  TransactionDisplayValues,
  txParams,
} from '@src/background/services/transactions/models';

export type ContractParserHandler = (
  request: txParams,
  data: any,
  props?: any
) => TransactionDisplayValues;
export type ContractParser = [ContractCall, ContractParserHandler];

export enum ContractCall {
  APPROVE = 'approve',
  SWAP_EXACT_TOKENS_FOR_TOKEN = 'swapExactTokensForTokens',
}

export interface SwapExactTokensForTokenData {
  amountIn: string;
  amountOutMin: string;
  contractCall: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKEN;
  deadline: string;
  path: string[];
  to: string;
}

export type BNWithDisplay = { bn: BN; value: string };
export type erc20PathToken = ERC20WithBalance & {
  amountIn?: BNWithDisplay;
  amountOut?: BNWithDisplay;
};
export interface SwapExactTokensForTokenDisplayValues
  extends TransactionDisplayValues {
  path: erc20PathToken[];
}
