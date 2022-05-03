import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { firstValueFrom, map, merge, of } from 'rxjs';
import { PermissionsService } from '../../permissions/PermissionsService';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionEvents } from '../../permissions/models';
import { injectable } from 'tsyringe';

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
    private permissionsService: PermissionsService,
    private accountsService: AccountsService
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

    const window = await openExtensionNewWindow(
      `permissions`,
      `domainName=${request.site?.name}&domainUrl=${request.site?.domain}&domainIcon=${request.site?.icon}`,
      request.meta?.coords
    );

    /**
     * If the user updates permissions and then closes the window then the permissions are written and this
     * promise is resolved. If not and the window is closed before then the promise will also be resolved and
     * the consumer will be notified that the window closed prematurely
     */

    const currentPermissions =
      await this.permissionsService.getPermissionsForDomain(
        request.site.domain
      );

    const permissionsSet = of(
      new Promise((resolve) => {
        if (
          this.accountsService.activeAccount &&
          currentPermissions?.accounts[
            this.accountsService.activeAccount.addressC
          ]
        ) {
          resolve(true);
          return;
        }
        const listener = (newPermissions) => {
          if (
            this.accountsService.activeAccount &&
            newPermissions?.[request.site.domain]?.accounts?.[
              this.accountsService.activeAccount.addressC
            ]
          ) {
            this.permissionsService.removeListener(
              PermissionEvents.PERMISSIONS_STATE_UPDATE,
              listener
            );
            resolve(true);
          }
        };
        this.permissionsService.addListener(
          PermissionEvents.PERMISSIONS_STATE_UPDATE,
          listener
        );
      })
    );

    // detect if users closes the window and take it as a rejection
    const windowClosed = window.removed.pipe(
      map(() => ({
        ...request,
        error: 'window removed before permissions set',
      }))
    );

    return firstValueFrom(merge(permissionsSet, windowClosed));
  };
}
