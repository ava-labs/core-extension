import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { personalSigRecovery } from '../../messages/utils/personalSigRecovery';

class PersonalEcRecoverHandler implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    const { params } = request;

    if (!params) {
      return {
        ...request,
        error: 'no params in request',
      };
    }

    const msg = params[0];
    const signedResult = params[1];

    const result = await personalSigRecovery(msg, signedResult);

    return { ...request, result };
  };

  handleAuthenticated = async (request) => {
    return await this.handleUnauthenticated(request);
  };
}

export const PersonalEcRecoverRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [DAppProviderRequest.PERSONAL_EC_RECOVER, new PersonalEcRecoverHandler()];
