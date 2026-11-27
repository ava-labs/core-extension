import { createContext, useContext } from 'react';
import type { TransferManager } from '@avalabs/fusion-sdk';

type TransferManagerContextValue = {
  manager: TransferManager | undefined;
  statusRevision: number;
};

export const TransferManagerContext =
  createContext<TransferManagerContextValue | null>(null);

export const useOptionalTransferManagerContext = () =>
  useContext(TransferManagerContext);
