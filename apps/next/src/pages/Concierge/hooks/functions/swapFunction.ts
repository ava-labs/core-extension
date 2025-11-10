import { isAPIError } from '@core/ui';
import { NetworkVMType, TokenType } from '@avalabs/vm-module-types';
import { stringToBigint } from '@core/common';

export interface SwapFunctionParams {
  amount: number;
  fromTokenAddress: string;
  toTokenAddress: string;
}

export interface SwapFunctionDeps {
  network: any;
  tokens: any[];
  allAvailableTokens: any[];
  getRate: (params: any) => Promise<any>;
  swap: (params: any) => Promise<void>;
}

export const createSwapFunction = ({
  network,
  tokens,
  allAvailableTokens,
  getRate,
  swap,
}: SwapFunctionDeps) => {
  return async ({
    amount,
    fromTokenAddress,
    toTokenAddress,
  }: SwapFunctionParams) => {
    if (network && network.vmName !== NetworkVMType.EVM) {
      throw new Error('Only EVM networks supported at the moment');
    }
    const srcToken = tokens.find(
      (item) =>
        item.symbol === fromTokenAddress ||
        ('address' in item && item.address === fromTokenAddress),
    );
    const toToken = allAvailableTokens.find(
      (item) =>
        item.symbol === toTokenAddress ||
        ('address' in item && item.address === toTokenAddress),
    );
    if (
      !srcToken ||
      (srcToken.type !== TokenType.ERC20 && srcToken.type !== TokenType.NATIVE)
    ) {
      throw new Error(`Cannot find the source token`);
    }
    if (
      !toToken ||
      (toToken.type !== TokenType.ERC20 && toToken.type !== TokenType.NATIVE)
    ) {
      throw new Error(`Cannot find the destination token`);
    }

    const amountBigInt = stringToBigint(amount.toString(), srcToken.decimals);

    const result = await getRate({
      srcDecimals: srcToken.decimals,
      srcToken:
        srcToken.type === TokenType.ERC20 ? srcToken.address : srcToken.symbol,
      destToken:
        toToken.type === TokenType.ERC20 ? toToken.address : toToken.symbol,
      destDecimals: toToken.decimals,
      srcAmount: amountBigInt.toString(),
      slippageTolerance: '0.15',
      onUpdate: () => {},
    });
    if (
      isAPIError(result) ||
      !result ||
      !result.quotes ||
      !result.selected ||
      !result.selected.quote
    ) {
      throw new Error(`An unknown error occurred`);
    }
    const selected = result.selected;
    const amountOut = selected.metadata.amountOut;

    if (!amountOut) {
      throw new Error('No rate found');
    }

    await swap({
      srcToken:
        srcToken.type === TokenType.ERC20 ? srcToken.address : srcToken.symbol,
      destToken:
        toToken.type === TokenType.ERC20 ? toToken.address : toToken.symbol,
      srcDecimals: srcToken.decimals,
      destDecimals: toToken.decimals,
      quote: selected.quote,
      swapProvider: result.provider,
      amountIn: amount.toString(),
      amountOut,
      slippage: 0.15,
    });

    return {
      content: `Swap initiated ${amount}${srcToken.symbol} to ${amountOut}${toToken.symbol}.`,
    };
  };
};
