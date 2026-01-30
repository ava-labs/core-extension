import { Quote } from '@avalabs/unified-asset-transfer';

import { bigintToBig } from '@core/common';

export const calculateRate = (quote: Quote): number => {
  const { amountOut, amountIn, assetIn, assetOut } = quote;
  if (!amountOut || !amountIn || !assetIn.decimals || !assetOut.decimals) {
    return 0;
  }

  const amountInBig = bigintToBig(amountIn, assetIn.decimals);
  const amountOutBig = bigintToBig(amountOut, assetOut.decimals);

  return amountOutBig.div(amountInBig).toNumber();
};
