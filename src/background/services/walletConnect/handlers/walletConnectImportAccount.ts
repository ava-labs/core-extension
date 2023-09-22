import { injectable } from 'tsyringe';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';

import { WalletConnectService } from '../WalletConnectService';
import { NetworkService } from '../../network/NetworkService';
import { AccountsService } from '../../accounts/AccountsService';
import {
  AccountType,
  ImportType,
  WalletConnectAddresses,
} from '../../accounts/models';
import { isCoreMobile } from '../utils';
import { PubKeyType } from '../../wallet/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
  boolean,
  [reconnectionAddress?: string]
>;

@injectable()
export class WalletConnectImportAccount implements HandlerType {
  method = ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT as const;

  constructor(
    private wcService: WalletConnectService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    if (!this.networkService.activeNetwork) {
      return {
        ...request,
        error: 'No network is active',
      };
    }
    const [reconnectionAddress] = request.params ?? [];

    try {
      const chainId = this.networkService.activeNetwork?.chainId;
      const { tabId } = request;

      const session = await this.wcService.connect({
        chainId,
        tabId,
        address: reconnectionAddress,
      });

      // If account was already connected, we only need to activate it after obtaining the sesssion.
      if (reconnectionAddress) {
        const { imported } = await this.accountsService.getAccounts();
        const account = Object.values(imported).find(
          (acc) => acc.addressC === reconnectionAddress
        );

        if (!account) {
          throw new Error(
            'Attempted to reconnect via WalletConnect, but the account was never imported in the first place'
          );
        }

        await this.accountsService.activateAccount(account.id);
      } else {
        const addressC = session.addresses[0];

        let addresses: WalletConnectAddresses = {
          addressC,
        };
        let pubKey: PubKeyType | undefined;

        if (isCoreMobile(session)) {
          // If we connected with Core Mobile, we can retrieve more addresses than just C-Chain's.
          const accounts = await this.wcService.avalancheGetAccounts({
            chainId,
            tabId,
            fromAddress: addressC,
          });

          // We can also fetch the public key, it will be useful when signing Avalanche transactions.
          pubKey = await this.#getPublicKey(chainId, addressC, tabId);

          const account = accounts.find(
            ({ addressC: mobileAddressC }) => mobileAddressC === addressC
          );

          if (account) {
            addresses = {
              addressC,
              addressBTC: account.addressBTC,
              addressAVM: account.addressAVM,
              addressPVM: account.addressPVM,
              addressCoreEth: account.addressCoreEth,
            };
          }
        }

        const { imported: importedAccounts } =
          await this.accountsService.getAccounts();

        const walletConnectAccounts = Object.values(importedAccounts).filter(
          ({ type }) => type === AccountType.WALLET_CONNECT
        );
        const id = await this.accountsService.addAccount(
          `WalletConnect #${walletConnectAccounts.length + 1}`,
          {
            importType: ImportType.WALLET_CONNECT,
            data: {
              addresses,
              pubKey,
            },
          }
        );

        await this.accountsService.activateAccount(id);
      }

      return {
        ...request,
        result: true,
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };

  async #getPublicKey(
    chainId: number,
    address: string,
    tabId?: number
  ): Promise<PubKeyType> {
    return this.wcService.request<PubKeyType>(
      {
        method: 'avalanche_getAccountPubKey',
        params: [],
      },
      {
        chainId,
        tabId,
        fromAddress: address,
      }
    );
  }
}
