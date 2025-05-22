import { injectable } from 'tsyringe';

import {
  ExtensionRequest,
  ImportType,
  IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP,
  ExtensionRequestHandler,
  FIREBLOCKS_APP_NAME,
  WalletConnectSessionInfo,
  PubKeyType,
} from '@core/types';

import { WalletConnectService } from '../WalletConnectService';
import { NetworkService } from '../../network/NetworkService';
import { AccountsService } from '../../accounts/AccountsService';
import { isCoreMobile } from '../utils';
import { Monitoring } from '@core/common';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
  { accountId: string; connectedApp: WalletConnectSessionInfo['walletApp'] },
  [reconnectionAddress?: string]
>;

type RequestPayload = Parameters<HandlerType['handle']>[0]['request'];

@injectable()
export class WalletConnectImportAccount implements HandlerType {
  method = ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT as const;

  constructor(
    private wcService: WalletConnectService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const network = await this.networkService.getNetwork(scope);

    if (!network) {
      return {
        ...request,
        error: 'Unknown network',
      };
    }
    const [reconnectionAddress] = request.params;

    try {
      const { tabId } = request;

      const session = await this.wcService.connect({
        chainId: network.chainId,
        tabId,
        address: reconnectionAddress,
      });

      // If account was already connected, we only need to activate it after obtaining the sesssion.
      if (reconnectionAddress) {
        const activatedAccountId =
          await this.#handleSuccessfulReconnection(request);

        return {
          ...request,
          result: {
            accountId: activatedAccountId,
            connectedApp: session.walletApp,
          },
        };
      }

      const importType = this.#getImportType(session);
      const accountData = await this.#getAccountData(request, session);
      const accountName = await this.#getDefaultAccountName(importType);

      const accountId = await this.accountsService.addImportedAccount({
        name: accountName,
        options: {
          importType,
          data: accountData,
        },
      });

      await this.accountsService.activateAccount(accountId);

      return {
        ...request,
        result: {
          accountId,
          connectedApp: session.walletApp,
        },
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };

  async #getAccountData(
    request: RequestPayload,
    session: WalletConnectSessionInfo,
  ) {
    const addressC = session.addresses[0];

    if (isCoreMobile(session)) {
      // If we connected with Core Mobile, we should be able to also retrieve
      // P/X-Chain, CoreEth and BTC addresses along with the C-Chain's.
      // And also the public key.
      try {
        const chainId = session.chains[0];
        const tabId = request.tabId;
        const accounts = await this.wcService.avalancheGetAccounts({
          chainId,
          tabId,
          fromAddress: addressC,
        });

        // We can also fetch the public key, it will be useful when signing Avalanche transactions.
        const pubKey = await this.#getPublicKey(chainId, addressC, tabId);

        const account = accounts.find(
          ({ addressC: mobileAddressC }) => mobileAddressC === addressC,
        );

        if (account) {
          return {
            pubKey,
            addresses: {
              addressC,
              addressBTC: account.addressBTC,
              addressAVM: account.addressAVM,
              addressPVM: account.addressPVM,
              addressCoreEth: account.addressCoreEth,
            },
          };
        }
      } catch (ex: any) {
        // We thought we can use Avalanche-specific methods with Core Mobile,
        // but apparently that's not the case. We can't do anything about it
        // at the moment, but it's not critical so the handler may continue.
        Monitoring.sentryCaptureException(
          ex as Error,
          Monitoring.SentryExceptionTypes.WALLETCONNECT,
        );
      }
    }

    return {
      addresses: {
        addressC,
      },
    };
  }

  #getImportType(
    session: WalletConnectSessionInfo,
  ): Exclude<ImportType, ImportType.PRIVATE_KEY> {
    return session.walletApp.name === FIREBLOCKS_APP_NAME
      ? ImportType.FIREBLOCKS
      : ImportType.WALLET_CONNECT;
  }

  async #handleSuccessfulReconnection(request: RequestPayload) {
    const { imported } = await this.accountsService.getAccounts();
    const [reconnectionAddress] = request.params;
    const account = Object.values(imported).find(
      (acc) => acc.addressC === reconnectionAddress,
    );

    if (!account) {
      throw new Error(
        'Attempted to reconnect via WalletConnect, but the account was never imported in the first place',
      );
    }

    await this.accountsService.activateAccount(account.id);

    return account.id;
  }

  async #getDefaultAccountName(importType: ImportType): Promise<string> {
    const { imported: importedAccounts } =
      await this.accountsService.getAccounts();

    const accountType = IMPORT_TYPE_TO_ACCOUNT_TYPE_MAP[importType];
    const accountsByType = Object.values(importedAccounts).filter(
      ({ type }) => type === accountType,
    );
    const prefix =
      importType === ImportType.FIREBLOCKS ? 'Fireblocks' : 'WalletConnect';

    return `${prefix} #${accountsByType.length + 1}`;
  }

  async #getPublicKey(
    chainId: number,
    address: string,
    tabId?: number,
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
      },
    );
  }
}
