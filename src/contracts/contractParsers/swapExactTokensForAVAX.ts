import { txParams } from '@src/background/services/transactions/models';
import {
  ContractCall,
  ContractParser,
  DisplayValueParserProps,
  SwapExactTokensForTokenDisplayValues,
} from './models';
import {
  BN,
  bigToLocaleString,
  bnToBig,
  Big,
} from '@avalabs/avalanche-wallet-sdk';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import { hexToBN } from '@src/utils/hexToBN';

export interface SwapExactTokensForAVAXData {
  amountOutMin: Big;
  amountIn: Big;
  contractCall: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS;
  deadline: string;
  path: string[];
  to: string;
}

export function swapExactTokensForAvax(
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: txParams,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: SwapExactTokensForAVAXData,
  props: DisplayValueParserProps
): SwapExactTokensForTokenDisplayValues {
  const erc20sIndexedByAddress: { [key: string]: ERC20WithBalance } =
    props.erc20Tokens.reduce(
      (acc, token) => ({ ...acc, [token.address.toLowerCase()]: token }),
      {}
    );

  const firstTokenInPath = erc20sIndexedByAddress[data.path[0].toLowerCase()];
  const lastTokenAmountBN = hexToBN(
    (data.amountIn || data.amountOutMin).toHexString()
  );
  const amountValue = bigToLocaleString(
    bnToBig(lastTokenAmountBN, firstTokenInPath.denomination),
    4
  );
  const amountUSDValue =
    (Number(firstTokenInPath.priceUSD) * Number(amountValue)).toFixed(2) ?? '';

  const tokenSwapped = {
    ...firstTokenInPath,
    amountIn: {
      bn: lastTokenAmountBN,
      value: amountValue,
    },
    amountUSDValue,
  };

  const avaxAmountInBN = hexToBN(data.amountOutMin.toHexString());
  const amountAvaxValue = bigToLocaleString(bnToBig(avaxAmountInBN, 18), 4);

  const avaxToken = {
    ...props.avaxToken,
    amountOut: {
      bn: avaxAmountInBN,
      value: amountAvaxValue,
    },
    amountUSDValue:
      (Number(props.avaxPrice) * Number(amountAvaxValue)).toFixed(2) ?? '',
  };

  const result = {
    path: [tokenSwapped, avaxToken],
    contractType: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS,
    ...parseBasicDisplayValues(request, props),
  };

  return result;
}

export const SwapExactTokensForAvaxParser: ContractParser = [
  ContractCall.SWAP_EXACT_TOKENS_FOR_AVAX,
  swapExactTokensForAvax,
];
