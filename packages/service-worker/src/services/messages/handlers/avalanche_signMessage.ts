import { injectable } from 'tsyringe';

import { openApprovalWindow } from '@/runtime/openApprovalWindow';
import { utils } from '@avalabs/avalanchejs';
import {
  Action,
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  MessageParams,
  MessageType,
  SignMessageData,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { WalletService } from '../../wallet/WalletService';

@injectable()
export class AvalancheSignMessageHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SIGN_MESSAGE];

  constructor(private walletService: WalletService) {
    super();
  }

  handleAuthenticated = async ({ request, scope }) => {
    const message = request.params[0] ?? undefined;

    if (!message) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      };
    }
    const accountIndex = request.params[1] ?? undefined;

    if (
      accountIndex !== undefined &&
      (typeof accountIndex !== 'number' || accountIndex < 0)
    ) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: `Invalid account index provided: ${accountIndex}`,
        }),
      };
    }

    const msgHex = Buffer.from(message, 'utf-8').toString('hex');

    const messageParams: MessageParams = {
      data: msgHex,
      from: '',
      accountIndex,
    };

    const actionData: Action<SignMessageData> = {
      ...request,
      scope,
      displayData: {
        messageParams,
        isMessageValid: true,
        validationError: undefined,
      },
    };

    // re-use the same approval window as ETH sign data
    await openApprovalWindow(actionData, `sign`);

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action<SignMessageData>,
    _,
    onSuccess,
    onError,
  ) => {
    try {
      const res = (await this.walletService.signMessage(
        MessageType.AVALANCHE_SIGN,
        pendingAction,
      )) as Buffer;

      if (!res) throw new Error('Failed to sign message');
      onSuccess(utils.base58check.encode(res));
    } catch (e) {
      onError(e);
    }
  };
}
