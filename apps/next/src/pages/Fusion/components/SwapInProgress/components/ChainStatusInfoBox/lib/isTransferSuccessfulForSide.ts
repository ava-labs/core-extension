import { Transfer } from '@avalabs/fusion-sdk';

type Side = 'source' | 'target';

export const isTransferSuccessfulForSide = (transfer: Transfer, side: Side) => {
  if (side === 'source') {
    if (
      transfer.status === 'source-completed' ||
      transfer.status === 'completed' ||
      transfer.status === 'target-pending'
    ) {
      return true;
    }

    if (transfer.source) {
      return (
        transfer.source.confirmationCount >=
        transfer.source.requiredConfirmationCount
      );
    }

    return false;
  }

  return transfer.status === 'completed';
};
