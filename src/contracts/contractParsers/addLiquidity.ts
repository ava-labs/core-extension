import { txParams } from '@src/background/services/transactions/models';
import {
  AddLiquidityDisplayData,
  ContractCall,
  ContractParser,
  DisplayValueParserProps,
  LiquidityPoolToken,
} from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { BigNumber } from 'ethers';
import { findToken } from './utils/findToken';
import { Network } from '@avalabs/chains-sdk';
import { bigToLocaleString, ethersBigNumberToBig } from '@avalabs/utils-sdk';

export interface AddLiquidityData {
  amountAMin: BigNumber;
  amountADesired: BigNumber;
  amountBMin: BigNumber;
  amountBDesired: BigNumber;
  contractCall: ContractCall.ADD_LIQUIDITY;
  deadline: string;
  tokenA: string;
  tokenB: string;
  to: string;
}

export async function addLiquidityHandler(
  network: Network,
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
): Promise<AddLiquidityDisplayData> {
  const tokenA = await findToken(data.tokenA.toLowerCase());
  const tokenB = await findToken(data.tokenB.toLowerCase());

  const firstTokenAmountDepositedDisplayValue = bigToLocaleString(
    ethersBigNumberToBig(data.amountADesired, tokenA.decimals),
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

  const secondTokenAmountDepositedDisplayValue = bigToLocaleString(
    ethersBigNumberToBig(data.amountBDesired, tokenB.decimals),
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
    ...parseBasicDisplayValues(network, request, props),
  };

  return result;
}

export const AddLiquidityParser: ContractParser = [
  ContractCall.ADD_LIQUIDITY,
  addLiquidityHandler,
];
