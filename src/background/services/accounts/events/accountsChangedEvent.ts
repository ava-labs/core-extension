import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
} from '@src/background/connections/models';
import { AccountsEvents } from '../models';
import { EventEmitter } from 'events';
import { AccountsService } from '../AccountsService';
import { PermissionsService } from '../../permissions/PermissionsService';
import { Web3Event } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';

@injectable()
export class AccountsChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(
    private accountsService: AccountsService,
    private permissionsService: PermissionsService
  ) {
    this.accountsService.addListener(
      AccountsEvents.ACCOUNTS_UPDATED,
      async () => {
        const currentPermissions =
          this._connectionInfo?.domain &&
          (await this.permissionsService.getPermissionsForDomain(
            this._connectionInfo.domain
          ));

        const hasAccessTodApp =
          currentPermissions &&
          this.accountsService.activeAccount?.addressC &&
          currentPermissions?.accounts?.[
            this.accountsService.activeAccount.addressC
          ];

        this.eventEmitter.emit('update', {
          method: Web3Event.ACCOUNTS_CHANGED,
          params: hasAccessTodApp
            ? [this.accountsService.activeAccount?.addressC]
            : [],
        });
      }
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
