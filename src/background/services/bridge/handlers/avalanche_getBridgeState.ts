import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';

@injectable()
export class AvalancheGetBridgeTransactionHandler
  implements DAppRequestHandler
{
  methods = [DAppProviderRequest.AVALANCHE_GET_BRIDGE_STATE];

  constructor(private bridgeService: BridgeService) {}

  handleAuthenticated = async (request) => {
    return {
      ...request,
      result: this.bridgeService.bridgeState,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
