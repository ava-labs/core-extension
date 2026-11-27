import type { TransferManager } from '@avalabs/fusion-sdk';

type LateJoinCapable = {
  onStatusChange?: (
    listener: (status: ReturnType<TransferManager['status']>) => void,
  ) => () => void;
  dispose?: () => void;
};

export const asLateJoinCapable = (manager: TransferManager) =>
  manager as TransferManager & LateJoinCapable;
