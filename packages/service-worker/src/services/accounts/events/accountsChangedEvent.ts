import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  DappPermissions,
  PermissionEvents,
  Permissions,
  Web3Event,
  AccountsEvents,
} from '@core/types';
import { EventEmitter } from 'events';
import { AccountsService } from '../AccountsService';
import { PermissionsService } from '../../permissions/PermissionsService';
import { injectable } from 'tsyringe';

type AccountsChangedEventData = string[];

/**
 * Emits `accountChanged` events for each dApp according to EIP-1193
 * https://eips.ethereum.org/EIPS/eip-1193#accountschanged-1
 */
@injectable()
export class AccountsChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;
  private _dappAccessibleAccounts?: string[];

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
    const addressC = activeAccount?.addressC;
    const hasAccessTodApp =
      currentPermissions &&
      addressC &&
      currentPermissions?.accounts?.[addressC];

    const accounts: AccountsChangedEventData = hasAccessTodApp
      ? [addressC]
      : [];

    this._dappAccessibleAccounts = accounts;
    this.eventEmitter.emit('update', {
      method: Web3Event.ACCOUNTS_CHANGED,
      params: accounts,
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
