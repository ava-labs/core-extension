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

export interface SwapExactTokensForTokenData {
  amountInMin: bigint;
  amountIn: bigint;
  amountInMax: bigint;

  amountOutMin: bigint;
  amountOut: bigint;
  amountOutMax: bigint;

  contractCall: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS;
  deadline: string;
  path: string[];
  to: string;
}

export async function swapExactTokensForTokenHandler(
  network: Network,
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: EthSendTransactionParamsWithGas,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: SwapExactTokensForTokenData,
  txDetails: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  const firstTokenInPath = await findToken(
    data.path[0]?.toLowerCase() || '',
    network
  );
  const lastTokenInPath = await findToken(
    data.path[data.path.length - 1]?.toLowerCase() || '',
    network
  );

  const sendTokenList: TransactionToken[] = [];
  const inAmount = data.amountIn || data.amountInMin || data.amountInMax;
  sendTokenList.push({
    address:
      firstTokenInPath.type === TokenType.ERC20
        ? firstTokenInPath.address
        : firstTokenInPath.symbol,
    decimals: firstTokenInPath.decimals,
    symbol: firstTokenInPath.symbol,
    name: firstTokenInPath.name,
    logoUri: firstTokenInPath.logoUri,

    amount: inAmount ? BigInt(inAmount) : undefined,
    usdValue:
      inAmount && firstTokenInPath.priceUSD
        ? Number(firstTokenInPath.priceUSD) *
          bigintToBig(inAmount, firstTokenInPath.decimals).toNumber()
        : undefined,
    usdPrice: firstTokenInPath.priceUSD,
  });

  const receiveTokenList: TransactionToken[] = [];
  const outAmout = data.amountOut || data.amountOutMin || data.amountOutMax;
  receiveTokenList.push({
    address:
      lastTokenInPath.type === TokenType.ERC20
        ? lastTokenInPath.address
        : lastTokenInPath.symbol,
    decimals: lastTokenInPath.decimals,
    symbol: lastTokenInPath.symbol,
    name: lastTokenInPath.name,
    logoUri: lastTokenInPath.logoUri,

    amount: outAmout ? BigInt(outAmout) : undefined,
    usdValue:
      outAmout && lastTokenInPath.priceUSD
        ? Number(lastTokenInPath.priceUSD) *
          bigintToBig(outAmout, lastTokenInPath.decimals).toNumber()
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

export const SwapExactTokensForTokenParser: ContractParser<SwapExactTokensForTokenData> =
  [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS, swapExactTokensForTokenHandler];

/**
 * This is for swaps from a token into a stable coin, same logic
 * its just telling the contract that the latter token needs to be
 * exact amount
 */
export const SwapTokensForExactTokensParser: ContractParser<SwapExactTokensForTokenData> =
  [ContractCall.SWAP_TOKENS_FOR_EXACT_TOKENS, swapExactTokensForTokenHandler];
