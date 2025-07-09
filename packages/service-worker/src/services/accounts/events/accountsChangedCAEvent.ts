import { injectable } from 'tsyringe';
import { EventEmitter } from 'events';
import { NetworkVMType } from '@avalabs/vm-module-types';

import {
  AccountsEvents,
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  Web3Event,
  DappPermissions,
  PermissionEvents,
  Permissions,
} from '@core/types';
import { getAllAddressesForAccount } from '@core/common';

import { AccountsService } from '../AccountsService';
import { PermissionsService } from '../../permissions/PermissionsService';

/**
 * Emits `accountChangedCA` events for each dApp
 */
@injectable()
export class AccountsChangedCAEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;
  private _dAppAccessibleAddresses?: { address: string; vm: NetworkVMType }[];

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService,
  ) {
    this.permissionsService.addListener(
      PermissionEvents.PERMISSIONS_STATE_UPDATE,
      async (permissions: unknown) => {
        const currentPermissions =
          permissions && this._connectionInfo?.domain
            ? (permissions as Permissions)[this._connectionInfo.domain]
            : undefined;
        this.emitAccountsChanged(currentPermissions);
      },
    );
    this.accountsService.addListener(
      AccountsEvents.ACCOUNTS_UPDATED,
      async () => {
        const currentPermissions = this._connectionInfo?.domain
          ? await this.permissionsService.getPermissionsForDomain(
              this._connectionInfo.domain,
            )
          : undefined;
        this.emitAccountsChanged(currentPermissions);
      },
    );
  }

  async emitAccountsChanged(currentPermissions?: DappPermissions) {
    const activeAccount = await this.accountsService.getActiveAccount();
    const activeAccountAddresses = getAllAddressesForAccount(
      activeAccount ?? {},
    ).map((address) => address.toLowerCase());

    const dAppAccessibleAddresses = Object.entries(
      currentPermissions?.accounts ?? {},
    )
      .filter(([address]) =>
        activeAccountAddresses.includes(address.toLowerCase()),
      )
      .map(([address, vm]) => ({ vm, address }));

    // access state of the dApp didn't change, we can return early
    if (
      JSON.stringify(dAppAccessibleAddresses) ===
      JSON.stringify(this._dAppAccessibleAddresses)
    ) {
      return;
    }

    this._dAppAccessibleAddresses = dAppAccessibleAddresses;
    this.eventEmitter.emit('update', {
      method: Web3Event.ACCOUNTS_CHANGED_CA,
      params: dAppAccessibleAddresses,
    });
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
