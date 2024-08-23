import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionToken,
  TransactionType,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { ContractCall, ContractParser } from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { findToken } from '../../../../../../utils/findToken';
import { Network } from '@avalabs/core-chains-sdk';
import { TransactionDescription } from 'ethers';
import { bigintToBig } from '@src/utils/bigintToBig';
import {
  TokenType,
  TokenWithBalanceEVM,
} from '@src/background/services/balances/models';

export interface SwapExactTokensForAVAXData {
  amountOutMin: bigint;
  amountIn: bigint;
  contractCall: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS;
  deadline: string;
  path: string[];
  to: string;
}

export async function swapExactTokensForAvax(
  network: Network,
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: EthSendTransactionParamsWithGas,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: SwapExactTokensForAVAXData,
  txDetails: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  const firstTokenInPath = (await findToken(
    data.path[0]?.toLowerCase() || '',
    network
  )) as TokenWithBalanceEVM;
  const networkTokenWithBalance = (await findToken(
    network.networkToken.symbol,
    network
  )) as TokenWithBalanceEVM;

  const sendTokenList: TransactionToken[] = [];

  sendTokenList.push({
    address:
      firstTokenInPath.type === TokenType.NATIVE
        ? firstTokenInPath.symbol
        : firstTokenInPath.address,
    decimals: firstTokenInPath.decimals,
    symbol: firstTokenInPath.symbol,
    name: firstTokenInPath.name,
    logoUri: firstTokenInPath.logoUri,

    amount: data.amountIn ? BigInt(data.amountIn) : undefined,
    usdValue:
      data.amountIn && firstTokenInPath.priceUSD
        ? Number(firstTokenInPath.priceUSD) *
          bigintToBig(data.amountIn, firstTokenInPath.decimals).toNumber()
        : undefined,
    usdPrice: firstTokenInPath.priceUSD,
  });

  const receiveTokenList: TransactionToken[] = [];

  receiveTokenList.push({
    address: networkTokenWithBalance.symbol,
    decimals: networkTokenWithBalance.decimals,
    symbol: networkTokenWithBalance.symbol,
    name: networkTokenWithBalance.name,
    logoUri: networkTokenWithBalance.logoUri,

    amount: data.amountOutMin ? BigInt(data.amountOutMin) : undefined,
    usdValue:
      data.amountOutMin && networkTokenWithBalance.priceUSD
        ? networkTokenWithBalance.priceUSD *
          bigintToBig(
            data.amountOutMin,
            networkTokenWithBalance.decimals
          ).toNumber()
        : undefined,
    usdPrice: networkTokenWithBalance.priceUSD,
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

export const SwapExactTokensForAvaxParser: ContractParser<SwapExactTokensForAVAXData> =
  [ContractCall.SWAP_EXACT_TOKENS_FOR_AVAX, swapExactTokensForAvax];
