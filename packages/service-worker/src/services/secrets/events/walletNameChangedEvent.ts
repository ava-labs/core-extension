import {
  ConnectionInfo,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  WalletEvents,
  Web3Event,
} from '@core/types';
import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import { getAllAddressesForAccount } from '@core/common';
import { SecretsService } from '../SecretsService';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionsService } from '../../permissions/PermissionsService';

type WalletNameChangedInfo = { walletId: string; name: string };

/**
 * Emits `walletNameChanged` events to dApps when a wallet is renamed.
 * Sends { walletId, name } so dApps can update the wallet label without refetching if they want to.
 * Only emits for wallets that contain at least one account the dApp had permission to access.
 */
@injectable()
export class WalletNameChangedEvents implements DAppEventEmitter {
  private eventEmitter = new EventEmitter();
  private _connectionInfo?: ConnectionInfo;

  setConnectionInfo(connectionInfo: ConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  constructor(
    private secretsService: SecretsService,
    private accountsService: AccountsService,
    private permissionsService: PermissionsService,
  ) {
    this.secretsService.addListener(
      WalletEvents.WALLET_NAME_CHANGED,
      async (data) => {
        await this.emitWalletNameChanged(data);
      },
    );
  }

  async emitWalletNameChanged(info: WalletNameChangedInfo) {
    if (!this._connectionInfo?.domain) {
      return;
    }

    const currentPermissions =
      await this.permissionsService.getPermissionsForDomain(
        this._connectionInfo.domain,
      );

    if (!currentPermissions?.accounts) {
      return;
    }

    const permittedAddresses = Object.keys(
      currentPermissions.accounts ?? {},
    ).map((addr) => addr.toLowerCase());

    const accountsInWallet =
      await this.accountsService.getPrimaryAccountsByWalletId(info.walletId);

    const hasAccess = accountsInWallet.some((account) => {
      const addresses = getAllAddressesForAccount(account);
      return addresses.some(
        (address) =>
          address && permittedAddresses.includes(address.toLowerCase()),
      );
    });

    if (hasAccess) {
      this.eventEmitter.emit('update', {
        method: Web3Event.WALLET_NAME_CHANGED,
        params: {
          walletId: info.walletId,
          name: info.name,
        },
      });
    }
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<unknown>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
