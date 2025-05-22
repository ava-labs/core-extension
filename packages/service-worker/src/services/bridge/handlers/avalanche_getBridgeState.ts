import { DAppProviderRequest, DAppRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';

@injectable()
export class AvalancheGetBridgeTransactionHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_BRIDGE_STATE];

  constructor(private bridgeService: BridgeService) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    return {
      ...request,
      result: this.bridgeService.bridgeState,
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
