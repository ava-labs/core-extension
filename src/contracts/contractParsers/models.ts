import { BN } from '@avalabs/avalanche-wallet-sdk';
import {
  AvaxWithBalance,
  ERC20WithBalance,
} from '@avalabs/wallet-react-components';
import { DomainMetadata } from '@src/background/models';
import { GasPrice } from '@src/background/services/gas/models';
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
export type erc20PathToken = (ERC20WithBalance | AvaxWithBalance) & {
  amountIn?: BNWithDisplay;
  amountOut?: BNWithDisplay;
  amountUSDValue?: string;
};
export interface SwapExactTokensForTokenDisplayValues
  extends TransactionDisplayValues {
  path: erc20PathToken[];
}

export type LiquidityPoolToken = (ERC20WithBalance | AvaxWithBalance) & {
  amountDepositedDisplayValue: string;
  amountUSDValue?: string;
};
export interface AddLiquidityDisplayData extends TransactionDisplayValues {
  poolTokens: LiquidityPoolToken[];
}

export interface ApproveTransactionData extends TransactionDisplayValues {
  tokenToBeApproved: ERC20WithBalance | AvaxWithBalance;
}

export interface DisplayValueParserProps {
  gasPrice: GasPrice;
  erc20Tokens: ERC20WithBalance[];
  avaxToken: AvaxWithBalance;
  avaxPrice: number;
  site: DomainMetadata;
}
