import { QRApprovalState } from './hooks/useQRApprovalState';

export type ErrorType = 'invalid-qr-code' | 'camera-access-denied';

export type StateComponentProps = {
  state: QRApprovalState;
  approve: () => Promise<unknown>;
  reject: () => void;
};
