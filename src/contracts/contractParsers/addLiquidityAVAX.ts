import { txParams } from '@src/background/services/transactions/models';
import {
  AddLiquidityDisplayData,
  ContractCall,
  ContractParser,
  DisplayValueParserProps,
  LiquidityPoolToken,
} from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';

export interface AddLiquidityAvaxData {
  amountAVAXMin: string;
  amountTokenDesired: string;
  amountTokenMin: string;
  contractCall: ContractCall.ADD_LIQUIDITY_AVAX;
  deadline: string;
  token: string;
  to: string;
}

export function addLiquidityAvaxHandler(
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: txParams,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: AddLiquidityAvaxData,
  props: DisplayValueParserProps
): AddLiquidityDisplayData {
  const erc20sIndexedByAddress = props.erc20Tokens.reduce(
    (acc, token) => ({ ...acc, [token.address]: token }),
    {}
  );

  const token = erc20sIndexedByAddress[data.token];
  const firstTokenDeposited = Utils.bigToLocaleString(
    Utils.bnToBig(new BN(data.amountAVAXMin), 18),
    4
  );
  const firstToken_AmountUSDValue =
    (Number(props.avaxPrice) * Number(firstTokenDeposited)).toFixed(2) ?? '';

  const firstToken: LiquidityPoolToken = {
    ...props.avaxToken,
    amountDepositedDisplayValue: firstTokenDeposited,
    amountUSDValue: firstToken_AmountUSDValue,
  };

  const secondTokenDeposited = Utils.bigToLocaleString(
    Utils.bnToBig(new BN(data.amountTokenDesired), token.denomination),
    4
  );
  const secondToken_AmountUSDValue =
    (Number(token.priceUSD) * Number(secondTokenDeposited)).toFixed(2) ?? '';

  const secondToken: LiquidityPoolToken = {
    ...token,
    amountDepositedDisplayValue: secondTokenDeposited,
    amountUSDValue: secondToken_AmountUSDValue,
  };
  const result = {
    poolTokens: [firstToken, secondToken],
    contractType: ContractCall.ADD_LIQUIDITY_AVAX,
    ...parseBasicDisplayValues(request, props),
  };

  return result;
}

export const AddLiquidityAvaxParser: ContractParser = [
  ContractCall.ADD_LIQUIDITY_AVAX,
  addLiquidityAvaxHandler,
];