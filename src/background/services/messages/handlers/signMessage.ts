import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { injectable } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { WalletService } from '../../wallet/WalletService';
import { MessageType } from '../models';
import { paramsToMessageParams } from '../utils/messageParamsParser';

@injectable()
export class PersonalSignHandler implements DAppRequestHandler {
  methods = [
    MessageType.ETH_SIGN,
    MessageType.SIGN_TYPED_DATA,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
    DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
    MessageType.PERSONAL_SIGN,
  ];
  constructor(
    private actionsService: ActionsService,
    private walletService: WalletService
  ) {}

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: `account not available`,
    };
  };

  handleAuthenticated = async (request) => {
    if (!this.walletService.walletState?.walletType) {
      return {
        ...request,
        error: 'wallet undefined',
      };
    }
    const actionData = {
      ...request,
      displayData: paramsToMessageParams(request),
      tabId: request.site.tabId,
    };
    await this.actionsService.addAction(actionData);

    await openExtensionNewWindow(
      `sign?id=${request.id}`,
      '',
      request.meta?.coords
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };
}
