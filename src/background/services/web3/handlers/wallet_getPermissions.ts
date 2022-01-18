import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
class WalletGetPermissionsHandler implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    return {
      ...request,
      result: [],
    };
  };
  handleAuthenticated = async (request) => {
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

export const WalletGetPermissionsRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.WALLET_GET_PERMISSIONS,
  new WalletGetPermissionsHandler(),
];
