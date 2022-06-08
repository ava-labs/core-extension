import { ActionsService } from './../../actions/ActionsService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

/**
 * This is called when the user requests to connect the via dapp. We need
 * to popup the permissions window, get permissions for the given domain
 * and then respond accordingly.
 *
 * @param data the rpc request
 * @returns
 */

@injectable()
export class ConnectRequestHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.CONNECT_METHOD];

  constructor(
    private accountsService: AccountsService,
    private actionsService: ActionsService
  ) {}

  handleAuthenticated = async (request) => {
    if (!this.accountsService.activeAccount) {
      return {
        ...request,
        error: 'wallet locked, undefined or malformed',
      };
    }

    return {
      ...request,
      result: [this.accountsService.activeAccount.addressC],
    };
  };

  handleUnauthenticated = async (request) => {
    if (!this.accountsService.activeAccount) {
      return {
        ...request,
        error: 'wallet locked, undefined or malformed',
      };
    }

    if (!request.site?.domain) {
      return {
        ...request,
        error: 'domain unknown',
      };
    }

    const actionData = {
      ...request,
      displayData: {
        domainName: request.site?.name,
        domainUrl: request.site?.domain,
        domainIcon: request.site?.icon,
      },
      tabId: request.site.tabId,
    };
    await this.actionsService.addAction(actionData);

    await openExtensionNewWindow(
      `permissions`,
      `domainName=${request.site?.name}&domainUrl=${request.site?.domain}&domainIcon=${request.site?.icon}&id=${request.id}`,
      request.meta?.coords
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };
}
