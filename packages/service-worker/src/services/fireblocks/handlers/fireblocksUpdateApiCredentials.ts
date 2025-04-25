import { importPKCS8 } from 'jose';
import { injectable } from 'tsyringe';

import { AccountsService } from '@/services/accounts/AccountsService';
import { NetworkService } from '@/services/network/NetworkService';
import { SecretsService } from '@/services/secrets/SecretsService';
import {
  AccountType,
  ExtensionRequest,
  ExtensionRequestHandler,
  FireblocksBtcAccessError,
  FireblocksBtcAccessErrorCode,
  FireblocksSecretsProvider,
  MAINNET_LOOKUP_ASSETS,
  SecretType,
  TESTNET_LOOKUP_ASSETS,
} from '@core/types';
import { FireblocksService } from '../FireblocksService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.FIREBLOCKS_UPDATE_API_CREDENTIALS,
  boolean,
  [accountId: string, apiKey: string, secretKey: string]
>;

@injectable()
export class FireblocksUpdateApiCredentialsHandler implements HandlerType {
  method = ExtensionRequest.FIREBLOCKS_UPDATE_API_CREDENTIALS as const;
  #fireblocksService?: FireblocksService;

  constructor(
    private accountsService: AccountsService,
    private networkService: NetworkService,
    private secretsService: SecretsService,
  ) {}

  async #getVaultAccountId(address: string) {
    if (!this.#fireblocksService) {
      throw new Error('Initialize the FireblocksService first');
    }

    const assetIds = this.networkService.isMainnet()
      ? MAINNET_LOOKUP_ASSETS
      : TESTNET_LOOKUP_ASSETS;

    const id = await this.#fireblocksService.fetchVaultAccountByWalletAddress(
      address,
      assetIds,
    );

    if (!id) {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.VaultAccountNotFound,
      );
    }

    return id;
  }

  async #getBtcAddress(vaultAccountId: string) {
    if (!this.#fireblocksService) {
      throw new Error('Initialize the FireblocksService first');
    }

    const address = await this.#fireblocksService.getBtcAddressByAccountId(
      vaultAccountId,
      this.networkService.isMainnet(),
    );

    if (!address) {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.BTCAddressNotFound,
      );
    }

    return address;
  }

  async #getSecretsProvider(
    apiKey: string,
    secretKey: string,
  ): Promise<FireblocksSecretsProvider> {
    try {
      const privateKey = await importPKCS8(secretKey, 'RS256');
      return {
        async getSecrets() {
          return {
            apiKey,
            privateKey,
          };
        },
      };
    } catch {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.InvalidSecretKey,
      );
    }
  }

  handle: HandlerType['handle'] = async ({ request }) => {
    const [coreAccountId, apiKey, secretKey] = request.params;

    try {
      this.#fireblocksService = new FireblocksService(
        await this.#getSecretsProvider(apiKey, secretKey),
      );

      const account = this.accountsService.getAccountByID(coreAccountId);

      if (!account) {
        throw new Error('No account found with the given ID');
      }

      if (account.type !== AccountType.FIREBLOCKS) {
        throw new FireblocksBtcAccessError(
          FireblocksBtcAccessErrorCode.WrongAccountType,
        );
      }

      const vaultAccountId = await this.#getVaultAccountId(account.addressC);
      const addressBTC = await this.#getBtcAddress(vaultAccountId);

      await this.secretsService.saveImportedWallet(coreAccountId, {
        secretType: SecretType.Fireblocks,
        addresses: {
          addressC: account.addressC,
          addressBTC,
        },
        api: {
          key: apiKey,
          secret: secretKey,
          vaultAccountId,
        },
      });

      await this.accountsService.refreshAddressesForAccount(coreAccountId);

      return {
        ...request,
        result: true,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e instanceof Error ? e.message : e.toString(),
      };
    }
  };
}
