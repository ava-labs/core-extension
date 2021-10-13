import { txParams } from '@src/background/services/transactions/models';
import {
  ContractCall,
  ContractParser,
  DisplayValueParserProps,
  SwapExactTokensForTokenDisplayValues,
} from './models';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import { hexToBN } from '@src/utils/hexToBN';

export interface SwapAVAXForExactTokensData {
  /**
   * Depending on function call one of these amounts will be truthy
   */
  amountOutMin: string;
  amountOut: string;
  contractCall: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS;
  deadline: string;
  path: string[];
  to: string;
}

export function swapAVAXForExactTokens(
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: txParams,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: SwapAVAXForExactTokensData,
  props: DisplayValueParserProps
): SwapExactTokensForTokenDisplayValues {
  const erc20sIndexedByAddress: { [key: string]: ERC20WithBalance } =
    props.erc20Tokens.reduce(
      (acc, token) => ({ ...acc, [token.address]: token }),
      {}
    );

  const avaxAmountInBN = request.value ? hexToBN(request.value) : new BN(0);
  const avaxToken = {
    ...props.avaxToken,
    amountIn: {
      bn: avaxAmountInBN,
      value: Utils.bigToLocaleString(Utils.bnToBig(avaxAmountInBN, 18), 4),
    },
  };

  const lastTokenInPath =
    erc20sIndexedByAddress[data.path[data.path.length - 1]];
  const lastTokenAmountBN = new BN(data.amountOut || data.amountOutMin);
  const tokenReceived = {
    ...lastTokenInPath,
    amountOut: {
      bn: lastTokenAmountBN,
      value: Utils.bigToLocaleString(
        Utils.bnToBig(lastTokenAmountBN, lastTokenInPath.denomination),
        4
      ),
    },
  };

  const result = {
    path: [avaxToken, tokenReceived],
    contractType: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS,
    ...parseBasicDisplayValues(request, props),
  };

  return result;
}

export const SwapAvaxForExactTokensParser: ContractParser = [
  ContractCall.SWAP_AVAX_FOR_EXACT_TOKENS,
  swapAVAXForExactTokens,
];

export const SwapExactAvaxForTokensParser: ContractParser = [
  ContractCall.SWAP_EXACT_AVAX_FOR_TOKENS,
  swapAVAXForExactTokens,
];
