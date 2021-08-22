import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { personalSigRecovery } from '../../messages/utils/personalSigRecovery';

export async function personal_ecRecover(data: ExtensionConnectionMessage) {
  const { params } = data;

  if (!params) {
    return {
      ...data,
      error: new Error('no params in request'),
    };
  }

  const msg = params[0];
  const signedResult = params[1];

  const result = await personalSigRecovery(msg, signedResult);

  return { ...data, result };
}

export const PersonalEcRecoverRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.PERSONAL_EC_RECOVER, personal_ecRecover];
