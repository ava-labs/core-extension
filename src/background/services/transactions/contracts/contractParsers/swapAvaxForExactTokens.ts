import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionToken,
  TransactionType,
} from '@src/background/services/transactions/models';
import { ContractCall, ContractParser } from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { findToken } from './utils/findToken';
import { Network } from '@avalabs/chains-sdk';
import { TransactionDescription } from 'ethers';
import { bigintToBig } from '@src/utils/bigintToBig';
import { TokenType } from '@src/background/services/balances/models';

export interface SwapAVAXForExactTokensData {
  /**
   * Depending on function call one of these amounts will be truthy
   */
  amountOutMin: bigint;
  amountOut: bigint;
  contractCall: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS;
  deadline: string;
  path: string[];
  to: string;
}

export async function swapAVAXForExactTokens(
  network: Network,
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: EthSendTransactionParamsWithGas,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: SwapAVAXForExactTokensData,
  txDetails: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  const lastTokenInPath = await findToken(
    data.path[data.path.length - 1]?.toLowerCase() || '',
    network
  );

  const receiveTokenList: TransactionToken[] = [];

  receiveTokenList.push({
    address:
      lastTokenInPath.type === TokenType.ERC20
        ? lastTokenInPath.address
        : lastTokenInPath.symbol,
    decimals: lastTokenInPath.decimals,
    symbol: lastTokenInPath.symbol,
    name: lastTokenInPath.name,
    logoUri: lastTokenInPath.logoUri,

    amount: BigInt(data.amountOut || data.amountOutMin),
    usdValue: lastTokenInPath.priceUSD
      ? Number(lastTokenInPath.priceUSD) *
        bigintToBig(
          data.amountOut || data.amountOutMin,
          lastTokenInPath.decimals
        ).toNumber()
      : undefined,
    usdPrice: lastTokenInPath.priceUSD,
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

  result.balanceChange.receiveTokenList = [
    ...result.balanceChange.receiveTokenList,
    ...receiveTokenList,
  ];

  return result;
}

export const SwapAvaxForExactTokensParser: ContractParser<SwapAVAXForExactTokensData> =
  [ContractCall.SWAP_AVAX_FOR_EXACT_TOKENS, swapAVAXForExactTokens];

export const SwapExactAvaxForTokensParser: ContractParser<SwapAVAXForExactTokensData> =
  [ContractCall.SWAP_EXACT_AVAX_FOR_TOKENS, swapAVAXForExactTokens];
