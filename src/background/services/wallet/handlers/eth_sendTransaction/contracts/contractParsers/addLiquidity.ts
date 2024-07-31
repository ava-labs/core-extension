import { ContractCall, ContractParser } from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { findToken } from '../../../../../../utils/findToken';
import { Network } from '@avalabs/core-chains-sdk';
import { bigintToBig } from '@src/utils/bigintToBig';
import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionToken,
  TransactionType,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { TransactionDescription } from 'ethers';
import { TokenType } from '@src/background/services/balances/models';

export interface AddLiquidityData {
  amountAMin: bigint;
  amountADesired: bigint;
  amountBMin: bigint;
  amountBDesired: bigint;
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
  request: EthSendTransactionParamsWithGas,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: AddLiquidityData,
  txDetails: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  const tokenA = await findToken(data.tokenA.toLowerCase(), network);
  const tokenB = await findToken(data.tokenB.toLowerCase(), network);

  const sendTokenList: TransactionToken[] = [];

  sendTokenList.push({
    address: tokenA.type === TokenType.ERC20 ? tokenA.address : tokenA.symbol,
    decimals: tokenA.decimals,
    symbol: tokenA.symbol,
    name: tokenA.name,
    logoUri: tokenA.logoUri,

    amount: BigInt(data.amountADesired),
    usdValue:
      tokenA.priceUSD !== undefined
        ? Number(tokenA.priceUSD) *
          bigintToBig(data.amountADesired, tokenA.decimals).toNumber()
        : undefined,
    usdPrice: tokenA.priceUSD,
  });

  sendTokenList.push({
    address: tokenB.type === TokenType.ERC20 ? tokenB.address : tokenB.symbol,
    decimals: tokenB.decimals,
    symbol: tokenB.symbol,
    name: tokenB.name,
    logoUri: tokenB.logoUri,

    amount: BigInt(data.amountBDesired),
    usdValue:
      tokenB.priceUSD !== undefined
        ? Number(tokenB.priceUSD) *
          bigintToBig(data.amountBDesired, tokenB.decimals).toNumber()
        : undefined,
    usdPrice: tokenB.priceUSD,
  });

  const result: TransactionDisplayValues = await parseBasicDisplayValues(
    network,
    request,
    txDetails
  );

  result.actions.push({
    type: TransactionType.CALL,
    fromAddress: request.from,
    contract: {
      address: request.to ?? '',
    },
  });
  result.balanceChange = result.balanceChange ?? {
    sendTokenList: [],
    receiveTokenList: [],
    sendNftList: [],
    receiveNftList: [],
  };

  result.balanceChange.sendTokenList = [
    ...result.balanceChange.sendTokenList,
    ...sendTokenList,
  ];

  return result;
}

export const AddLiquidityParser: ContractParser<AddLiquidityData> = [
  ContractCall.ADD_LIQUIDITY,
  addLiquidityHandler,
];
