import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';
import { ActionStatus } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_SELECT_WALLET_FOR_DAPP,
  true,
  [requestId: string, domain: string, tabId: number, selectedIndex: number]
>;

/**
 * Selecting a wallet is a speacial action since the wallet doesn't need to be unlocked to do it
 * We are using the actionsService to emit the result of the selection.
 * If the user selects Core, the the regular login-required flows will kick in.
 */
@injectable()
export class SelectWalletExtensionForDappHandler implements HandlerType {
  method = ExtensionRequest.WALLET_SELECT_WALLET_FOR_DAPP as const;

  constructor(private actionsService: ActionsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [requestId, domain, tabId, selectedIndex] = request.params;

    this.actionsService.emitResult(
      requestId,
      {
        jsonrpc: '2.0',
        method: 'avalanche_selectWallet',
        id: requestId,
        time: Date.now(),
        status: ActionStatus.COMPLETED,
        tabId,
        site: {
          domain,
          tabId,
        },
        displayData: {},
      },
      selectedIndex >= 0, // in case the user does not select -1 is used
      selectedIndex >= 0
        ? selectedIndex
        : ethErrors.provider.userRejectedRequest()
    );

    return {
      ...request,
      result: true,
    };
  };
}
