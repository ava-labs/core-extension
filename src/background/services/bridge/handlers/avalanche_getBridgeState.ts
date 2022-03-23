import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { bridge$ } from '../bridge';
import { firstValueFrom } from 'rxjs';

class AvalancheGetBridgeTransactionHandler implements DappRequestHandler {
  handleAuthenticated = async (request) => {
    const bridge = await firstValueFrom(bridge$);

    return {
      ...request,
      result: bridge,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}

export const AvalancheGetBridgeStateRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.AVALANCHE_GET_BRIDGE_STATE,
  new AvalancheGetBridgeTransactionHandler(),
];
