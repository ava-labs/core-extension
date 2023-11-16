import { DerivationPath } from '@avalabs/wallets-sdk';
import { omit, pick } from 'lodash';
import { container, singleton } from 'tsyringe';

import { AccountsService } from '../accounts/AccountsService';
import { AccountType, ImportType } from '../accounts/models';
import { StorageService } from '../storage/StorageService';
import {
  BtcWalletPolicyDetails,
  ImportedWalletData,
  WalletSecretInStorage,
  WALLET_STORAGE_KEY,
  SeedlessAuthProvider,
} from '../wallet/models';

import {
  AccountWithSecrets,
  ImportedAccountSecrets,
  PrimaryAccountSecrets,
  SecretType,
} from './models';

/**
 * Use this service to fetch, save or delete account secrets.
 */
@singleton()
export class SecretsService {
  constructor(private storageService: StorageService) {}

  async updateSecrets(secrets: Partial<WalletSecretInStorage>) {
    if ('imported' in secrets) {
      throw new Error(
        'Please use designated methods to manage imported wallets'
      );
    }

    const existingSecrets = await this.#loadSecrets(false);

    await this.storageService.save<Partial<WalletSecretInStorage>>(
      WALLET_STORAGE_KEY,
      {
        ...existingSecrets,
        ...secrets,
      }
    );
  }

  async getPrimaryAccountSecrets(): Promise<PrimaryAccountSecrets | null> {
    const walletKeys = await this.#loadSecrets(false);

    if (!walletKeys) {
      return null;
    }

    return this.#parsePrimarySecrets(walletKeys);
  }

  async getImportedAccountSecrets(
    accountId: string
  ): Promise<ImportedAccountSecrets> {
    const walletKeys = await this.#loadSecrets(true);
    const accountData = walletKeys.imported?.[accountId];

    if (!accountData) {
      throw new Error('No secrets found for imported account');
    }

    // Imported via private key submission
    if (accountData.type === ImportType.PRIVATE_KEY) {
      return {
        type: SecretType.PrivateKey,
        secret: accountData.secret,
      };
    }

    if (accountData.type === ImportType.WALLET_CONNECT) {
      return {
        type: SecretType.WalletConnect,
        addresses: accountData.addresses,
        pubKey: accountData.pubKey,
      };
    }

    if (accountData.type === ImportType.FIREBLOCKS) {
      return {
        type: SecretType.Fireblocks,
        addresses: accountData.addresses,
        api: accountData.api,
      };
    }

    throw new Error('Unsupported import type');
  }

  async getActiveAccountSecrets(): Promise<AccountWithSecrets> {
    const walletKeys = await this.#loadSecrets(true);

    // But later on, we rely on the active account only.
    // To resolve circular dependencies we are  getting accounts service on the fly instead of via constructor
    const accountsService = container.resolve(AccountsService);
    const { activeAccount } = accountsService;

    if (!activeAccount || activeAccount.type === AccountType.PRIMARY) {
      const secrets = await this.#parsePrimarySecrets(walletKeys);

      return {
        ...(activeAccount ? { account: activeAccount } : null),
        ...secrets,
      };
    }

    const secrets = await this.getImportedAccountSecrets(activeAccount.id);

    return {
      account: activeAccount,
      ...secrets,
    };
  }

  async deleteImportedWallets(
    ids: string[]
  ): Promise<Record<string, ImportedWalletData | undefined>> {
    const { imported, ...primarySecrets } = await this.#loadSecrets(true);

    const deleted = pick(imported, ids);
    const newImported = omit(imported, ids);

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      ...primarySecrets,
      imported: newImported,
    });

    return deleted;
  }

  async saveImportedWallet(id: string, data: ImportedWalletData) {
    const secrets = await this.#loadSecrets(true);

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      ...secrets,
      imported: {
        ...secrets.imported,
        [id]: data,
      },
    });
  }

  async storeBtcWalletPolicyDetails(
    xpub: string,
    masterFingerprint: string,
    hmacHex: string,
    name: string
  ) {
    const secrets = await this.getActiveAccountSecrets();

    if (
      secrets.type !== SecretType.Ledger &&
      secrets.type !== SecretType.LedgerLive
    ) {
      throw new Error(
        'Error while saving wallet policy details: incorrect wallet type.'
      );
    }

    const { account } = secrets;

    if (secrets.type === SecretType.LedgerLive && account) {
      const pubKeys = secrets.pubKeys ?? [];
      const pubKeyInfo = pubKeys[account.index];

      if (!pubKeyInfo) {
        throw new Error(
          'Error while saving wallet policy details: missing record for the provided index.'
        );
      }

      if (pubKeyInfo?.btcWalletPolicyDetails) {
        throw new Error(
          'Error while saving wallet policy details: policy details already stored.'
        );
      }

      pubKeyInfo.btcWalletPolicyDetails = {
        xpub,
        masterFingerprint,
        hmacHex,
        name,
      };

      pubKeys[account.index] = pubKeyInfo;

      return await this.updateSecrets({
        pubKeys,
      });
    }

    if (secrets.type === SecretType.Ledger) {
      if (secrets?.btcWalletPolicyDetails) {
        throw new Error(
          'Error while saving wallet policy details: policy details already stored.'
        );
      }

      return await this.updateSecrets({
        btcWalletPolicyDetails: {
          xpub,
          masterFingerprint,
          hmacHex,
          name,
        },
      });
    }

    throw new Error(
      'Error while saving wallet policy details: unknown derivation path.'
    );
  }

  async getBtcWalletPolicyDetails(): Promise<
    { accountIndex: number; details?: BtcWalletPolicyDetails } | undefined
  > {
    const secrets = await this.getActiveAccountSecrets();

    if (secrets.type === SecretType.LedgerLive && secrets.account) {
      const accountIndex = secrets.account.index;
      const pubKeyInfo = secrets.pubKeys[accountIndex];

      return {
        accountIndex,
        details: pubKeyInfo?.btcWalletPolicyDetails,
      };
    }

    if (secrets.type === SecretType.Ledger) {
      return {
        accountIndex: 0,
        details: secrets.btcWalletPolicyDetails,
      };
    }
  }

  async #loadSecrets(strict: true): Promise<WalletSecretInStorage | never>;
  async #loadSecrets(strict: false): Promise<WalletSecretInStorage | null>;
  async #loadSecrets(strict: boolean): Promise<WalletSecretInStorage | null> {
    const walletKeys = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!walletKeys && strict) {
      throw new Error('Wallet is not initialized');
    }

    return walletKeys ?? null;
  }

  #parsePrimarySecrets(
    walletKeys: WalletSecretInStorage
  ): PrimaryAccountSecrets {
    const {
      mnemonic,
      masterFingerprint,
      pubKeys,
      xpub,
      xpubXP,
      derivationPath,
      btcWalletPolicyDetails,
      seedlessSignerToken,
      authProvider,
    } = walletKeys;

    if (seedlessSignerToken) {
      return {
        type: SecretType.Seedless,
        pubKeys: pubKeys ?? [],
        seedlessSignerToken,
        derivationPath,
        authProvider: authProvider ?? SeedlessAuthProvider.Google,
      };
    }

    // If we have a phrase, we know it's a mnemonic wallet
    if (mnemonic && xpub && xpubXP) {
      return {
        type: SecretType.Mnemonic,
        mnemonic,
        xpub,
        xpubXP,
        derivationPath,
      };
    }

    // If we have a master fingerprint and an xpub, we're dealing with Keystone
    if (masterFingerprint && xpub) {
      return {
        type: SecretType.Keystone,
        xpub,
        masterFingerprint,
        derivationPath,
      };
    }

    // If we don't have the phrase or the fingerprint, but we do have xpub,
    // we're dealing with Ledger + BIP44 derivation path
    if (xpub) {
      return {
        type: SecretType.Ledger,
        xpub,
        xpubXP,
        derivationPath: DerivationPath.BIP44,
        btcWalletPolicyDetails,
      };
    }

    // If we have none of the above, but we do have public keys,
    // we're dealing with Ledger + LedgerLive derivation path.
    if (pubKeys) {
      return {
        type: SecretType.LedgerLive,
        pubKeys,
        derivationPath: DerivationPath.LedgerLive,
      };
    }

    throw new Error('Unknown secrets found for primary account');
  }
}
