import { injectable } from 'tsyringe';

import { WalletService } from '../../wallet/WalletService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import {
  MessageParams,
  MessageType,
} from '@src/background/services/messages/models';
import { utils } from '@avalabs/avalanchejs-v2';

@injectable()
export class AvalancheSignMessageHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SIGN_MESSAGE];

  constructor(private walletService: WalletService) {
    super();
  }

  handleAuthenticated = async (request) => {
    const message = request.params[0] ?? undefined;

    if (!message) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      };
    }

    const msgHex = Buffer.from(message, 'utf-8').toString('hex');

    const messageParams: MessageParams = {
      data: msgHex,
      from: '',
    };

    const actionData = {
      ...request,
      displayData: {
        messageParams,
        isMessageValid: true,
        validationError: undefined,
      },
      tabId: request.site.tabId,
    };

    // re-use the same approval window as ETH sign data
    await this.openApprovalWindow(actionData, `sign`);

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    _,
    onSuccess,
    onError,
    frontendTabId?: number
  ) => {
    try {
      const res = (await this.walletService.signMessage(
        MessageType.AVALANCHE_SIGN,
        pendingAction
      )) as Buffer;

      if (!res) throw new Error('Failed to sign message');
      onSuccess(utils.base58check.encode(res));
    } catch (e) {
      onError(e);
    }
  };
}
