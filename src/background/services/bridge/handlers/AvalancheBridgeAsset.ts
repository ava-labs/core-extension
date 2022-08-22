import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { BridgeService } from '../BridgeService';

// this is used for coreX web
@injectable()
export class AvalancheBridgeAsset extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET];

  constructor(private bridgeService: BridgeService) {
    super();
  }

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

    await this.openApprovalWindow(action, `approve?id=${request.id}`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    const currentBlockchain = pendingAction?.displayData.currentBlockchain;
    const amountStr = pendingAction?.displayData.amountStr;
    const asset = pendingAction?.displayData.asset;
    const denomination = asset.denomination;
    try {
      const result = await this.bridgeService.transferAsset(
        currentBlockchain,
        bnToBig(stringToBN(amountStr, denomination), denomination),
        asset
      );
      onSuccess(result);
    } catch (e) {
      onError(e);
    }
  };
}
