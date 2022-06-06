import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';

@injectable()
export class MetamaskSendDomainMetadataHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.DOMAIN_METADATA_METHOD];

  handleUnauthenticated = async (request) => {
    return { ...request, result: request.params };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };
}
