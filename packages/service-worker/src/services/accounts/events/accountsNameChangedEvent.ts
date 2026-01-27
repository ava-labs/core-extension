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

type AccountNameChangedInfo = {
  id: string;
  addressC?: string;
  oldName: string;
  newName: string;
};

type AccountNameChangedEventData = {
  address: string;
  oldName: string;
  newName: string;
};

/**
 * Emits `accountNameChanged` events to dApps when account names are changed.
 * Only emits for accounts that the dApp had permission to access.
 */
@injectable()
export class AccountsNameChangedEvents implements DAppEventEmitter {
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
      AccountsEvents.ACCOUNT_NAME_CHANGED,
      async (nameChangedInfo: AccountNameChangedInfo) => {
        await this.emitAccountNameChanged(nameChangedInfo);
      },
    );
  }

  async emitAccountNameChanged(nameChangedInfo: AccountNameChangedInfo) {
    if (!this._connectionInfo?.domain) {
      return;
    }

    const account = await this.accountsService.getAccountByID(
      nameChangedInfo.id,
    );
    if (!account) {
      return;
    }

    const allAddresses = getAllAddressesForAccount(account);
    const addressC =
      nameChangedInfo.addressC ||
      account.addressC ||
      allAddresses.find((addr) => addr);

    if (!addressC) {
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

    // Check if the dApp has permission to access this account
    const permittedAddresses = Object.keys(
      currentPermissions.accounts ?? {},
    ).map((addr) => addr.toLowerCase());

    const hasAccess = allAddresses.some(
      (address) =>
        address && permittedAddresses.includes(address.toLowerCase()),
    );

    // Only emit if the dApp had permission to access this account
    if (hasAccess) {
      const eventData: AccountNameChangedEventData = {
        address: addressC,
        oldName: nameChangedInfo.oldName,
        newName: nameChangedInfo.newName,
      };

      this.eventEmitter.emit('update', {
        method: Web3Event.ACCOUNT_NAME_CHANGED,
        params: eventData,
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
