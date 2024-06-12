import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';

@injectable()
export class WalletGetPermissionsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_GET_PERMISSIONS];

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      result: [],
    };
  };
  handleAuthenticated = async ({ request }) => {
    return {
      ...request,
      result: [
        {
          invoker: request.site.domain,
          parentCapability: 'accounts',
        },
      ],
    };
  };
}
