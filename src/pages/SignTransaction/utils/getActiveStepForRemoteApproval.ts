import { WalletConnectSessionInfo } from '@src/background/services/walletConnect/models';

export enum ApprovalStep {
  APPROVAL,
  CONNECT,
  SENT,
  LOADING,
}

export const getActiveStep = (
  requestSent: boolean,
  activeSession: WalletConnectSessionInfo | null,
  isNewConnectionRequired: boolean,
) => {
  if (requestSent) {
    return ApprovalStep.SENT;
  }
  if (activeSession && !isNewConnectionRequired) {
    return ApprovalStep.APPROVAL;
  }
  if (isNewConnectionRequired) {
    return ApprovalStep.CONNECT;
  }
  return ApprovalStep.LOADING;
};
