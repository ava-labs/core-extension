import { Transfer } from '@avalabs/fusion-sdk';

type Side = 'source' | 'target';

export const isTransferSuccessfulForSide = (transfer: Transfer, side: Side) => {
  if (side === 'source') {
    return (
      transfer.status === 'source-completed' ||
      transfer.status === 'completed' ||
      transfer.status === 'target-pending'
    );
  }

  return transfer.status === 'completed';
};
