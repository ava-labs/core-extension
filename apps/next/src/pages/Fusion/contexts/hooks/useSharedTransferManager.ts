import { useOptionalTransferManagerContext } from '../TransferManagerContext';
import { useTransferManager } from './useTransferManager';

export const useSharedTransferManager = () => {
  const shared = useOptionalTransferManagerContext();
  const own = useTransferManager({ enabled: !shared });

  return shared ?? own;
};
