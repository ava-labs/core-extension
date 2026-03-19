import { Transfer } from '@avalabs/fusion-sdk';

export const getTransferTxHash = (
  side: 'source' | 'target' | 'refund',
  transfer?: Transfer,
) => {
  if (!transfer) return undefined;

  return side in transfer ? transfer[side]?.txHash : undefined;
};
