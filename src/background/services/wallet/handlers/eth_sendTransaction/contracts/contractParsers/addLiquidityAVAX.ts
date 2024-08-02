import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionToken,
  TransactionType,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { ContractCall, ContractParser } from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { Network } from '@avalabs/core-chains-sdk';
import { bigintToBig } from '@src/utils/bigintToBig';
import { TransactionDescription } from 'ethers';
import { findToken } from '../../../../../../utils/findToken';
import {
  TokenType,
  TokenWithBalanceEVM,
} from '@src/background/services/balances/models';

export interface AddLiquidityAvaxData {
  amountAVAXMin: bigint;
  amountTokenDesired: bigint;
  amountTokenMin: bigint;
  contractCall: ContractCall.ADD_LIQUIDITY_AVAX;
  deadline: string;
  token: string;
  to: string;
}

export async function addLiquidityAvaxHandler(
  network: Network,
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: EthSendTransactionParamsWithGas,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: AddLiquidityAvaxData,
  txDetails: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  const token = (await findToken(
    data.token.toLowerCase(),
    network
  )) as TokenWithBalanceEVM;
  const sendTokenList: TransactionToken[] = [];

  sendTokenList.push({
    address: token.type === TokenType.ERC20 ? token.address : token.symbol,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    logoUri: token.logoUri,

    amount: BigInt(data.amountTokenDesired),
    usdValue:
      token.priceUSD !== undefined
        ? Number(token.priceUSD) *
          bigintToBig(data.amountTokenDesired, token.decimals).toNumber()
        : undefined,
    usdPrice: token.priceUSD,
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

export const AddLiquidityAvaxParser: ContractParser<AddLiquidityAvaxData> = [
  ContractCall.ADD_LIQUIDITY_AVAX,
  addLiquidityAvaxHandler,
];
