import { KeystoneUsbApprovalState } from './types';
import { useKeystoneUsbContext } from '@core/ui';

export const useKeystoneUsbApprovalState = (): KeystoneUsbApprovalState => {
  const { hasKeystoneTransport, wasTransportAttempted } =
    useKeystoneUsbContext();

  if (!wasTransportAttempted) {
    return 'loading';
  }

  if (!hasKeystoneTransport) {
    return 'disconnected';
  }

  return 'pending';
};
