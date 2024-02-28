import { omit, pick } from 'lodash';
import { container, singleton } from 'tsyringe';

import { AccountsService } from '../accounts/AccountsService';
import { AccountType } from '../accounts/models';
import { StorageService } from '../storage/StorageService';
import {
  BtcWalletPolicyDetails,
  WalletSecretInStorage,
  WALLET_STORAGE_KEY,
  AddPrimaryWalletSecrets,
  WalletDetails,
  PubKeyType,
} from '../wallet/models';
import {
  ImportedAccountSecrets,
  PrimaryWalletSecrets,
  SecretType,
} from './models';
import { isPrimaryAccount } from '../accounts/utils/typeGuards';
import _ from 'lodash';

/**
 * Use this service to fetch, save or delete account secrets.
 */
@singleton()
export class SecretsService {
  constructor(private storageService: StorageService) {}

  async #getDefaultName(secrets: AddPrimaryWalletSecrets) {
    const defaultNames = {
      [SecretType.Mnemonic]: 'Seed Phrase',
      [SecretType.Ledger]: 'Ledger',
      [SecretType.LedgerLive]: 'Ledger Live',
      [SecretType.Keystone]: 'Keystone',
      [SecretType.Seedless]: 'Seedless',
    };
    const storedSecrets = await this.#loadSecrets(false);
    const exisitingCount =
      storedSecrets?.wallets.filter((w) => w.secretType === secrets.secretType)
        .length ?? 0;
    const nextNumber = exisitingCount + 1;
    const walletNumber = nextNumber < 10 ? `0${nextNumber}` : nextNumber;
    return `${defaultNames[secrets.secretType]} ${walletNumber}`;
  }

  async addSecrets(secrets: AddPrimaryWalletSecrets) {
    const storedSecrets = await this.#loadSecrets(false);
    const existingWallets = storedSecrets?.wallets;
    const walletId = crypto.randomUUID();
    const wallets = existingWallets ?? [];
    wallets.push({
      ...secrets,
      id: walletId,
      name: secrets.name ?? (await this.#getDefaultName(secrets)),
    });

    await this.storageService.save<Partial<WalletSecretInStorage>>(
      WALLET_STORAGE_KEY,
      {
        ...storedSecrets,
        wallets,
      }
    );
    return walletId;
  }

  async getPrimaryWalletsDetails(): Promise<WalletDetails[]> {
    const secrets = await this.#loadSecrets(false);

    if (!secrets) {
      return [];
    }

    return secrets.wallets.map((wallet) => {
      if (wallet.secretType === SecretType.Seedless) {
        return {
          id: wallet.id,
          name: wallet.name,
          type: wallet.secretType,
          derivationPath: wallet.derivationPath,
          authProvider: wallet.authProvider,
          userEmail: wallet.userEmail,
        };
      }

      return {
        id: wallet.id,
        name: wallet.name,
        type: wallet.secretType,
        derivationPath: wallet.derivationPath,
      };
    });
  }

  async updateSecrets(
    secrets: Partial<PrimaryWalletSecrets>,
    walletId: string
  ): Promise<string | null> {
    const storedSecrets = await this.#loadSecrets(false);

    const updatedWalletSecrets = storedSecrets?.wallets.map((wallet) => {
      if (wallet.id === walletId) {
        return {
          ...wallet,
          ...secrets,
        };
      }
      return { ...wallet };
    });

    if (updatedWalletSecrets) {
      await this.storageService.save<Partial<WalletSecretInStorage>>(
        WALLET_STORAGE_KEY,
        {
          ...storedSecrets,
          wallets: [...updatedWalletSecrets] as PrimaryWalletSecrets[],
        }
      );
      return walletId;
    }

    return null;
  }

  async deleteSecrets(walletId: string) {
    const storedSecrets = await this.#loadSecrets(false);

    const updatedWalletSecrets = storedSecrets?.wallets.filter(
      (wallet) => wallet.id !== walletId
    );

    const updatedImportedSecrets = storedSecrets?.importedAccounts;
    if (updatedImportedSecrets) {
      delete updatedImportedSecrets[walletId];
    }
    if (updatedWalletSecrets) {
      await this.storageService.save<Partial<WalletSecretInStorage>>(
        WALLET_STORAGE_KEY,
        {
          ...updatedImportedSecrets,
          wallets: [...updatedWalletSecrets],
        }
      );
    }
  }

  getActiveWalletSecrets(walletKeys: WalletSecretInStorage) {
    const accountsService = container.resolve(AccountsService);

    const activeWalletId = isPrimaryAccount(accountsService.activeAccount)
      ? accountsService.activeAccount.walletId
      : accountsService.activeAccount?.id;

    if (walletKeys.wallets.length === 1) {
      return walletKeys.wallets[0];
    }
    return walletKeys.wallets.find((wallet) => wallet.id === activeWalletId);
  }

  async getPrimaryAccountSecrets() {
    const walletKeys = await this.#loadSecrets(false);

    if (!walletKeys) {
      return null;
    }
    const activeWalletSecrets = this.getActiveWalletSecrets(walletKeys);

    if (!activeWalletSecrets) {
      return null;
    }

    return activeWalletSecrets;
  }

  async getImportedAccountSecrets(
    accountId: string
  ): Promise<ImportedAccountSecrets> {
    const walletKeys = await this.#loadSecrets(true);

    const accountData = walletKeys.importedAccounts?.[accountId];

    if (!accountData) {
      throw new Error('No secrets found for imported account');
    }

    // Imported via private key submission
    if (accountData.secretType === SecretType.PrivateKey) {
      return {
        secretType: SecretType.PrivateKey,
        secret: accountData.secret,
      };
    }

    if (accountData.secretType === SecretType.WalletConnect) {
      return {
        secretType: SecretType.WalletConnect,
        addresses: accountData.addresses,
        pubKey: accountData.pubKey,
      };
    }

    if (accountData.secretType === SecretType.Fireblocks) {
      return {
        secretType: SecretType.Fireblocks,
        addresses: accountData.addresses,
        api: accountData.api,
      };
    }

    throw new Error('Unsupported import type');
  }

  async getActiveAccountSecrets() {
    const walletKeys = await this.#loadSecrets(true);

    // But later on, we rely on the active account only.
    // To resolve circular dependencies we are  getting accounts service on the fly instead of via constructor
    const accountsService = container.resolve(AccountsService);

    const { activeAccount } = accountsService;

    if (!activeAccount || activeAccount.type === AccountType.PRIMARY) {
      const activeWalletSecrets = this.getActiveWalletSecrets(walletKeys);

      if (!activeWalletSecrets) {
        throw new Error('There is no values for this account');
      }

      return {
        ...(activeAccount ? { account: activeAccount } : null),
        ...activeWalletSecrets,
      };
    }

    const secrets = await this.getImportedAccountSecrets(activeAccount.id);

    return {
      account: activeAccount,
      ...secrets,
    };
  }

  async getWalletAccountsSecretsById(walletId: string) {
    const walletKeys = await this.#loadSecrets(true);

    const walletSecrets = walletKeys.wallets.find(
      (wallet) => wallet.id === walletId
    );

    if (!walletSecrets) {
      throw new Error('There is no values for this wallet');
    }
    if (!walletSecrets.secretType) {
      throw new Error('Unknown secrets found for primary account');
    }

    return walletSecrets;
  }

  async deleteImportedWallets(
    ids: string[]
  ): Promise<Record<string, ImportedAccountSecrets | undefined>> {
    const { importedAccounts, ...primarySecrets } = await this.#loadSecrets(
      true
    );

    const deleted = pick(importedAccounts, ids);
    const newImported = omit(importedAccounts, ids);

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      ...primarySecrets,
      importedAccounts: newImported,
    });

    return deleted;
  }

  async saveImportedWallet(id: string, data: ImportedAccountSecrets) {
    const secrets = await this.#loadSecrets(true);

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      ...secrets,
      importedAccounts: {
        ...secrets.importedAccounts,
        [id]: data,
      },
    });
  }

  async storeBtcWalletPolicyDetails(
    xpub: string,
    masterFingerprint: string,
    hmacHex: string,
    name: string,
    walletId: string
  ) {
    const secrets = await this.getActiveAccountSecrets();

    if (
      secrets.secretType !== SecretType.Ledger &&
      secrets.secretType !== SecretType.LedgerLive
    ) {
      throw new Error(
        'Error while saving wallet policy details: incorrect wallet type.'
      );
    }

    const { account } = secrets;

    if (secrets.secretType === SecretType.LedgerLive && account) {
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

      return await this.updateSecrets(
        {
          pubKeys,
        },
        walletId
      );
    }

    if (secrets.secretType === SecretType.Ledger) {
      if (secrets?.btcWalletPolicyDetails) {
        throw new Error(
          'Error while saving wallet policy details: policy details already stored.'
        );
      }

      return await this.updateSecrets(
        {
          btcWalletPolicyDetails: {
            xpub,
            masterFingerprint,
            hmacHex,
            name,
          },
        },
        walletId
      );
    }

    throw new Error(
      'Error while saving wallet policy details: unknown derivation path.'
    );
  }

  async getBtcWalletPolicyDetails(): Promise<
    { accountIndex: number; details?: BtcWalletPolicyDetails } | undefined
  > {
    const secrets = await this.getActiveAccountSecrets();

    if (secrets.secretType === SecretType.LedgerLive && secrets.account) {
      const accountIndex = secrets.account.index;
      const pubKeyInfo = secrets.pubKeys[accountIndex];

      return {
        accountIndex,
        details: pubKeyInfo?.btcWalletPolicyDetails,
      };
    }

    if (secrets.secretType === SecretType.Ledger) {
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

  async isKnownSecret(
    type: SecretType.Mnemonic,
    mnemonic: string
  ): Promise<boolean>;
  async isKnownSecret(
    type: SecretType.PrivateKey,
    privateKey: string
  ): Promise<boolean>;
  async isKnownSecret(
    type: SecretType.LedgerLive | SecretType.Ledger,
    pub: string | PubKeyType[]
  ): Promise<boolean>;
  async isKnownSecret(
    type:
      | SecretType.Mnemonic
      | SecretType.PrivateKey
      | SecretType.Ledger
      | SecretType.LedgerLive,
    secret: unknown
  ): Promise<boolean> {
    const secrets = await this.#loadSecrets(false);

    if (!secrets) {
      return false;
    }

    if (type === SecretType.Mnemonic) {
      return secrets.wallets.some(
        (wallet) =>
          wallet.secretType === SecretType.Mnemonic &&
          wallet.mnemonic === secret
      );
    }

    if (type === SecretType.PrivateKey) {
      if (!secrets.importedAccounts) {
        return false;
      }

      return Object.values(secrets.importedAccounts).some(
        (acc) =>
          acc.secretType === SecretType.PrivateKey && acc.secret === secret
      );
    }

    if (type === SecretType.Ledger) {
      return secrets.wallets.some(
        (wallet) =>
          wallet.secretType === SecretType.Ledger && wallet.xpub === secret
      );
    }

    if (type === SecretType.LedgerLive) {
      return secrets.wallets.some((wallet) => {
        return (
          wallet.secretType === SecretType.LedgerLive &&
          Array.isArray(secret) &&
          _.isEqual(wallet.pubKeys[0], secret[0])
        );
      });
    }

    throw new Error('Unsupported secret type');
  }
}
