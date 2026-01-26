import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  AccountsEvents,
  Web3Event,
} from '@core/types';
import { EventEmitter } from 'events';
import { AccountsService } from '../AccountsService';
import { PermissionsService } from '../../permissions/PermissionsService';
import { injectable } from 'tsyringe';
import { getAllAddressesForAccount } from '@core/common';

type DeletedAccountInfo = {
  id: string;
  addressC?: string;
  addressAVM?: string;
  addressPVM?: string;
  addressBTC?: string;
  addressCoreEth?: string;
  addressSVM?: string;
};

type AccountsDeletedEventData = string[];

/**
 * Emits `accountsDeleted` events to dApps when accounts are deleted.
 * Only emits addresses for accounts that the dApp had permission to access.
 */
@injectable()
export class AccountsDeletedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService,
  ) {
    this.accountsService.addListener(
      AccountsEvents.ACCOUNTS_DELETED,
      async (deletedAccounts: DeletedAccountInfo[]) => {
        await this.emitAccountsDeleted(deletedAccounts);
      },
    );
  }

  async emitAccountsDeleted(deletedAccounts: DeletedAccountInfo[]) {
    if (!this._connectionInfo?.domain || deletedAccounts.length === 0) {
      return;
    }

    // Get current permissions for this domain
    const currentPermissions =
      await this.permissionsService.getPermissionsForDomain(
        this._connectionInfo.domain,
      );

    if (!currentPermissions?.accounts) {
      return;
    }

    const deletedAccountAddresses: AccountsDeletedEventData = [];

    const permittedAddresses = Object.keys(
      currentPermissions.accounts ?? {},
    ).map((addr) => addr.toLowerCase());

    for (const deletedAccount of deletedAccounts) {
      const allAddresses = getAllAddressesForAccount(deletedAccount);

      const hadAccess = allAddresses.some(
        (address) =>
          address && permittedAddresses.includes(address.toLowerCase()),
      );

      if (hadAccess && deletedAccount.addressC) {
        deletedAccountAddresses.push(deletedAccount.addressC);
      }
    }

    if (deletedAccountAddresses.length > 0) {
      this.eventEmitter.emit('update', {
        method: Web3Event.ACCOUNTS_DELETED,
        params: deletedAccountAddresses,
      });
    }
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
