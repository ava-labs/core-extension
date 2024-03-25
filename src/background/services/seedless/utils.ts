import {
  SignerSession,
  UserExportInitResponse,
} from '@cubist-labs/cubesigner-sdk';
import { ArrayElement } from '@src/background/models';
import { MfaRequestType, RecoveryMethod } from './models';

export const isTokenExpiredError = (
  err: unknown
): err is Error & { status: 403 } => {
  // When CubeSigner's refresh token (or the entire session) expires,
  // we get a 403 Forbidden error on attempted API calls.
  return err instanceof Error && 'status' in err && err.status === 403;
};

export const isFailedMfaError = (
  err: unknown
): err is Error & { status: 403 } => {
  // When CubeSigner's refresh token (or the entire session) expires,
  // we get a 403 Forbidden error on attempted API calls.
  return (
    err instanceof Error &&
    'status' in err &&
    err.status === 403 &&
    err.message.includes('Invalid')
  );
};

export const isExportRequestOutdated = (
  exportRequest: UserExportInitResponse
) => exportRequest.exp_epoch <= Date.now() / 1000;

export const mapMfasToRecoveryMethods = (
  method: ArrayElement<Awaited<ReturnType<SignerSession['user']>>['mfa']>
): RecoveryMethod => {
  if (method.type === 'fido') {
    return {
      ...method,
      type: MfaRequestType.Fido,
    };
  }

  return {
    type: MfaRequestType.Totp,
  };
};
