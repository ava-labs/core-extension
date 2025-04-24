import { DAppRequestHandler } from '../../../connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@core/types/src/models';
import { injectable } from 'tsyringe';
import { personalSigRecovery } from '../utils/personalSigRecovery';

@injectable()
export class PersonalEcRecoverHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.PERSONAL_EC_RECOVER];

  handleUnauthenticated = async ({ request }) => {
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
