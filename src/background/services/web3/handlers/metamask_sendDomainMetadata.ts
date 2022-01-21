import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';

class MetamaskSendDomainMetadataHandler implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    return { ...request, result: request.params };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };
}

export const SetDomainMetadataRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.DOMAIN_METADATA_METHOD,
  new MetamaskSendDomainMetadataHandler(),
];
