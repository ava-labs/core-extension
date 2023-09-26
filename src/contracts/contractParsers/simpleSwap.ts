import { txParams } from '@src/background/services/transactions/models';
import {
  ContractCall,
  ContractParser,
  DisplayValueParserProps,
  SimpleSwapDisplayValues,
} from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { findToken } from './utils/findToken';
import { Network } from '@avalabs/chains-sdk';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
} from '@src/background/services/balances/models';
import { isAvaxToken, getAmount } from './utils/helpers';
export interface SimpleSwapData {
  data: {
    beneficiary: string;
    callees: string[];
    deadline: bigint;
    exchangeData: string;
    exchangeAmount: bigint;
    feePercent: bigint;
    fromAmount: bigint;
    fromToken: string;
    partner: string;
    permint: string;
    startIndexes: bigint[];
    toAmount: bigint;
    toToken: string;
    uuid: string;
  };
}

export async function simpleSwapHandler(
  network: Network,
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: txParams,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  { data }: SimpleSwapData,
  props: DisplayValueParserProps
): Promise<SimpleSwapDisplayValues> {
  const fromToken = isAvaxToken(data.fromToken)
    ? props.avaxToken
    : await findToken(data.fromToken, network);
  const toToken = isAvaxToken(data.toToken)
    ? props.avaxToken
    : await findToken(data.toToken, network);
  const toAmount: bigint = data.toAmount;
  const fromAmount: bigint = data.fromAmount;

  const path: (TokenWithBalanceERC20 | NetworkTokenWithBalance)[] = [];

  const fromTokenInfo = getAmount(fromAmount, fromToken);
  const swapFromToken = {
    ...fromToken,
    amountIn: {
      bn: fromTokenInfo.bn,
      value: fromTokenInfo.amountValue,
    },
    amountUSDValue: fromTokenInfo.amountUSDValue,
  };

  const toTokenInfo = getAmount(toAmount, toToken);
  const swapToToken = {
    ...toToken,
    amountOut: {
      bn: toTokenInfo.bn,
      value: toTokenInfo.amountValue,
    },
    amountUSDValue: toTokenInfo.amountUSDValue,
  };

  path.push(swapFromToken, swapToToken);

  const result = {
    path,
    contractType: ContractCall.SIMPLE_SWAP,
    ...parseBasicDisplayValues(network, request, props),
  };

  return result;
}

export const SimpleSwapParser: ContractParser = [
  ContractCall.SIMPLE_SWAP,
  simpleSwapHandler,
];
