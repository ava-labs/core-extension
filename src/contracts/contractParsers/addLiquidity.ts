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

export interface AddLiquidityData {
  amountAMin: string;
  amountADesired: string;
  amountBMin: string;
  amountBDesired: string;
  contractCall: ContractCall.ADD_LIQUIDITY;
  deadline: string;
  tokenA: string;
  tokenB: string;
  to: string;
}

export function addLiquidityHandler(
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: txParams,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: AddLiquidityData,
  props: DisplayValueParserProps
): AddLiquidityDisplayData {
  const erc20sIndexedByAddress = props.erc20Tokens.reduce(
    (acc, token) => ({ ...acc, [token.address]: token }),
    {}
  );

  const tokenA = erc20sIndexedByAddress[data.tokenA];
  const tokenB = erc20sIndexedByAddress[data.tokenB];

  const firstTokenAmountDepositedDisplayValue = Utils.bigToLocaleString(
    Utils.bnToBig(new BN(data.amountADesired), tokenA.denomination),
    4
  );
  const tokenA_AmountUSDValue =
    (
      Number(tokenA.priceUSD) * Number(firstTokenAmountDepositedDisplayValue)
    ).toFixed(2) ?? '';
  const firstToken: LiquidityPoolToken = {
    ...tokenA,
    amountDepositedDisplayValue: firstTokenAmountDepositedDisplayValue,
    amountUSDValue: tokenA_AmountUSDValue,
  };

  const secondTokenAmountDepositedDisplayValue = Utils.bigToLocaleString(
    Utils.bnToBig(new BN(data.amountBDesired), tokenB.denomination),
    4
  );
  const tokenB_AmountUSDValue =
    (
      Number(tokenB.priceUSD) * Number(secondTokenAmountDepositedDisplayValue)
    ).toFixed(2) ?? '';
  const secondToken: LiquidityPoolToken = {
    ...tokenB,
    amountDepositedDisplayValue: secondTokenAmountDepositedDisplayValue,
    amountUSDValue: tokenB_AmountUSDValue,
  };

  const result = {
    poolTokens: [firstToken, secondToken],
    contractType: ContractCall.ADD_LIQUIDITY,
    ...parseBasicDisplayValues(request, props),
  };

  return result;
}

export const AddLiquidityParser: ContractParser = [
  ContractCall.ADD_LIQUIDITY,
  addLiquidityHandler,
];
