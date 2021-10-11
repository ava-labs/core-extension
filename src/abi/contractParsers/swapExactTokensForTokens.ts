import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { txParams } from '@src/background/services/transactions/models';
import {
  ContractCall,
  ContractParser,
  erc20PathToken,
  SwapExactTokensForTokenData,
  SwapExactTokensForTokenDisplayValues,
} from './models';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';

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
  props: {
    gasPrice: GasPrice;
    erc20Tokens: ERC20WithBalance[];
    avaxPrice: number;
  }
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
      const bn = new BN(data.amountIn);

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
      const bn = new BN(data.amountOutMin);

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

  const bnFee = props.gasPrice.bn.mul(new BN(parseInt(request.gas as string)));
  const fee = Utils.bigToLocaleString(Utils.bnToBig(bnFee, 18), 4);

  const result = {
    /**
     * Contract this is being sent to
     */
    toAddress: request.to,
    /**
     * The wallet this is being sent from
     */
    fromAddress: request.from,
    /**
     * The smart contract paths
     */
    path,
    contractType: ContractCall.SWAP_EXACT_TOKENS_FOR_TOKEN,
    gasPrice: props.gasPrice,
    gasLimit: parseInt(request.gas as string),
    total: props.gasPrice.bn.add(new BN(5)).toString(),
    fee,
    feeUSD: parseFloat((parseFloat(fee) * props.avaxPrice).toFixed(4)),
  };

  return result;
}

export const SwapExactTokensForTokenParser: ContractParser = [
  ContractCall.SWAP_EXACT_TOKENS_FOR_TOKEN,
  swapExactTokensForTokenHandler,
];
