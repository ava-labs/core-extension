import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';

/**
 * This handler is an empty request handler to fit into the regular flow of rpc calls.
 * The DOMAIN_METADATA requests are stored and handled in the SiteMetadataMiddleware.
 */
@injectable()
export class AvalancheSendDomainMetadataHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.DOMAIN_METADATA_METHOD];

  handleUnauthenticated = async (request) => {
    return { ...request, result: request.params };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };
}
