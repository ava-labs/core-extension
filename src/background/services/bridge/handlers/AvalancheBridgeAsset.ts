import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { injectable } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';

// this is used for coreX web
@injectable()
export class AvalancheBridgeAsset implements DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET];

  constructor(private actionsService: ActionsService) {}

  handleAuthenticated = async (request) => {
    const [currentBlockchain, amountStr, asset] = request.params || [];

    const action = {
      ...request,
      displayData: {
        currentBlockchain,
        amountStr,
        asset,
      },
      tabId: request.site.tabId,
    };
    await this.actionsService.addAction(action);

    await openExtensionNewWindow(
      `approve?id=${request.id}`,
      '',
      request.meta?.coords
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
