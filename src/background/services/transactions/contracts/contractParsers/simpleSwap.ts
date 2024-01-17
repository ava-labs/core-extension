import { ContractCall, ContractParser } from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { findToken } from './utils/findToken';
import { Network } from '@avalabs/chains-sdk';
import { TokenType } from '@src/background/services/balances/models';
import { TransactionDescription } from 'ethers';
import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionToken,
  TransactionType,
} from '@src/background/services/transactions/models';
import { bigintToBig } from '@src/utils/bigintToBig';
import { isNetworkToken } from './utils/helpers';
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
  request: EthSendTransactionParamsWithGas,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  { data }: SimpleSwapData,
  txDetails: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  const fromToken = isNetworkToken(data.fromToken)
    ? await findToken(network.networkToken.symbol, network)
    : await findToken(data.fromToken, network);
  const toToken = isNetworkToken(data.toToken)
    ? await findToken(network.networkToken.symbol, network)
    : await findToken(data.toToken, network);

  const sendTokenList: TransactionToken[] = [];
  const receiveTokenList: TransactionToken[] = [];

  sendTokenList.push({
    address:
      fromToken.type === TokenType.NATIVE
        ? fromToken.symbol
        : fromToken.address,
    decimals: fromToken.decimals,
    symbol: fromToken.symbol,
    name: fromToken.name,
    logoUri: fromToken.logoUri,

    amount: BigInt(data.fromAmount),
    usdValue: fromToken.priceUSD
      ? Number(fromToken.priceUSD) *
        bigintToBig(data.fromAmount, fromToken.decimals).toNumber()
      : undefined,
    usdPrice: fromToken.priceUSD,
  });

  receiveTokenList.push({
    address:
      toToken.type === TokenType.NATIVE ? toToken.symbol : toToken.address,
    decimals: toToken.decimals,
    symbol: toToken.symbol,
    name: toToken.name,
    logoUri: toToken.logoUri,

    amount: BigInt(data.toAmount),
    usdValue: toToken.priceUSD
      ? Number(toToken.priceUSD) *
        bigintToBig(data.fromAmount, toToken.decimals).toNumber()
      : undefined,
    usdPrice: toToken.priceUSD,
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

  result.balanceChange.receiveTokenList = [
    ...result.balanceChange.receiveTokenList,
    ...receiveTokenList,
  ];

  return result;
}

export const SimpleSwapParser: ContractParser<SimpleSwapData> = [
  ContractCall.SIMPLE_SWAP,
  simpleSwapHandler,
];
