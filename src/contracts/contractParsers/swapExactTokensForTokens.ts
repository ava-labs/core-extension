import { txParams } from '@src/background/services/transactions/models';
import {
  ContractCall,
  ContractParser,
  DisplayValueParserProps,
  erc20PathToken,
  SwapExactTokensForTokenDisplayValues,
} from './models';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';

export interface SwapExactTokensForTokenData {
  amountInMin: string;
  amountIn: string;
  amountInMax: string;

  amountOutMin: string;
  amountOut: string;
  amountOutMax: string;

  contractCall: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS;
  deadline: string;
  path: string[];
  to: string;
}

export function swapExactTokensForTokenHandler(
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: txParams,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: SwapExactTokensForTokenData,
  props: DisplayValueParserProps
): SwapExactTokensForTokenDisplayValues {
  const erc20sIndexedByAddress = props.erc20Tokens.reduce(
    (acc, token) => ({ ...acc, [token.address]: token }),
    {}
  );

  const firstTokenInPath = data.path[0];
  const lastTokenInPath = data.path[data.path.length - 1];
  const path: erc20PathToken[] = data.path.map((address) => {
    const pathToken = erc20sIndexedByAddress[address] ?? { address };

    if (pathToken.address === firstTokenInPath && pathToken.denomination) {
      const bn = new BN(data.amountIn || data.amountInMax || data.amountInMax);

      return {
        ...pathToken,
        amountIn: {
          bn,
          value: Utils.bigToLocaleString(
            Utils.bnToBig(bn, pathToken.denomination),
            4
          ),
        },
      };
    }

    if (pathToken.address === lastTokenInPath && pathToken.denomination) {
      const bn = new BN(
        data.amountOutMin || data.amountOut || data.amountOutMax
      );

      return {
        ...pathToken,
        amountOut: {
          bn,
          value: Utils.bigToLocaleString(
            Utils.bnToBig(bn, pathToken.denomination),
            4
          ),
        },
      };
    }
    return pathToken;
  });

  const result = {
    path,
    contractType: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS,
    ...parseBasicDisplayValues(request, props),
  };

  return result;
}

export const SwapExactTokensForTokenParser: ContractParser = [
  ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS,
  swapExactTokensForTokenHandler,
];

/**
 * This is for swaps from a token into a stable coin, same logic
 * its just telling the contract that the latter token needs to be
 * exact amount
 */
export const SwapTokensForExactTokensParser: ContractParser = [
  ContractCall.SWAP_TOKENS_FOR_EXACT_TOKENS,
  swapExactTokensForTokenHandler,
];
