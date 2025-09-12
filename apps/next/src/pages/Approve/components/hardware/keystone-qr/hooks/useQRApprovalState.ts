import { useCallback, useEffect, useState } from 'react';

import {
  KeystoneDeviceRequestData,
  KeystoneDeviceResponseData,
} from '@core/types';
import { useCameraPermissions, useKeystoneContext } from '@core/ui';

import { ErrorType } from '../types';

type Phase =
  | 'waiting-for-tx-code'
  | 'scan-transaction-qr'
  | 'scan-signature-qr';

export type QRApprovalState = {
  phase: Phase;
  txRequest?: KeystoneDeviceRequestData;
  error: ErrorType | undefined;
  isSubmitting: boolean;
  setHasQRError: (hasQRError: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  requestSignature: () => void;
  submitSignature: (response: KeystoneDeviceResponseData) => Promise<boolean>;
  permissions?: PermissionState;
};

export const useQRApprovalState = () => {
  const { txRequest, submitSignature } = useKeystoneContext();

  const [hasQRError, setHasQRError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [phase, setPhase] = useState<Phase>('waiting-for-tx-code');

  const { permissions } = useCameraPermissions();

  const error: ErrorType | undefined =
    permissions !== 'granted'
      ? 'camera-access-denied'
      : hasQRError
        ? 'invalid-qr-code'
        : undefined;

  const requestSignature = useCallback(() => setPhase('scan-signature-qr'), []);

  useEffect(() => {
    if (txRequest) {
      setPhase('scan-transaction-qr');
    } else {
      setPhase('waiting-for-tx-code');
    }
  }, [txRequest]);

  return {
    phase,
    txRequest,
    error,
    isSubmitting,
    setHasQRError,
    setIsSubmitting,
    permissions,
    requestSignature,
    submitSignature,
  };
};
