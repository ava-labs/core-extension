import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';

@injectable()
export class MetamaskSendDomainMetadataHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.DOMAIN_METADATA_METHOD];

  handleUnauthenticated = async (request) => {
    return { ...request, result: request.params };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };
}
