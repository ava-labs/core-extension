import { omit, pick, uniqWith } from 'lodash';
import { singleton } from 'tsyringe';

import {
  Avalanche,
  DerivationPath,
  getLedgerExtendedPublicKey,
} from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import {
  assertPresent,
  getAvalancheExtendedKeyPath,
  getAvalancheXPub,
  getEvmExtendedKeyPath,
  isPrimaryAccount,
  mapVMAddresses,
} from '@core/common';
import {
  Account,
  AccountType,
  AccountWithSecrets,
  AddPrimaryWalletSecrets,
  AddressPublicKeyJson,
  BtcWalletPolicyDetails,
  Curve,
  EVM_BASE_DERIVATION_PATH,
  ExtendedPublicKey,
  ImportData,
  ImportedAccountSecrets,
  ImportType,
  isKeystoneSecrets,
  IsKnownSecretResult,
  LedgerError,
  PrimaryWalletSecrets,
  SecretType,
  WalletDetails,
  WalletEvents,
  WalletSecretInStorage,
} from '@core/types';
import EventEmitter from 'events';
import { OnUnlock } from '../../runtime/lifecycleCallbacks';
import { LedgerService } from '../ledger/LedgerService';
import { SeedlessTokenStorage } from '../seedless/SeedlessTokenStorage';
import { SeedlessWallet } from '../seedless/SeedlessWallet';
import { StorageService } from '../storage/StorageService';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { AddressPublicKey } from './AddressPublicKey';
import { AddressResolver } from './AddressResolver';
import {
  getExtendedPublicKey,
  hasPublicKeyFor,
  isPrimaryWalletSecrets,
} from './utils';

type WalletStateUpdateCallback = (data: WalletDetails[]) => void;
type WalletNameUpdateCallback = (data: {
  walletId: string;
  name: string;
}) => void;

/**
 * Use this service to fetch, save or delete account secrets.
 */
@singleton()
export class SecretsService implements OnUnlock {
  #eventEmitter = new EventEmitter();

  /**
   * This is used when we need to store a secret temporarily,
   * like when we need to calculate addresses for a private key
   * before letting the AccountService commit the secret.
   */
  #temporarySecretStorage = new Map<string, ImportedAccountSecrets>();

  constructor(private storageService: StorageService) {}

  async #getDefaultName(secrets: AddPrimaryWalletSecrets) {
    const defaultNames = {
      [SecretType.Mnemonic]: 'Recovery Phrase',
      [SecretType.Ledger]: 'Ledger',
      [SecretType.LedgerLive]: 'Ledger Live',
      [SecretType.Keystone]: 'Keystone',
      [SecretType.Keystone3Pro]: 'Keystone3 Pro',
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

  private async emitWalletsInfo() {
    const wallets = await this.getPrimaryWalletsDetails();

    this.#eventEmitter.emit(WalletEvents.WALLET_STATE_UPDATE, wallets);
  }

  addListener(
    event: WalletEvents.WALLET_STATE_UPDATE,
    callback: WalletStateUpdateCallback,
  ): void;
  addListener(
    event: WalletEvents.WALLET_NAME_CHANGED,
    callback: WalletNameUpdateCallback,
  ): void;
  addListener(
    event: WalletEvents,
    callback: WalletStateUpdateCallback | WalletNameUpdateCallback,
  ): void {
    this.#eventEmitter.on(event, callback);
  }

  async onUnlock(): Promise<void> {
    await this.emitWalletsInfo();
  }

  async addSecrets(secrets: AddPrimaryWalletSecrets) {
    const storedSecrets = await this.#loadSecrets(false);
    const existingWallets = storedSecrets?.wallets;
    const walletId = crypto.randomUUID();
    const wallets = existingWallets ?? [];
    wallets.push({
      ...secrets,
      id: walletId,
      name: secrets.name || (await this.#getDefaultName(secrets)),
    });

    await this.storageService.save<Partial<WalletSecretInStorage>>('wallet', {
      ...storedSecrets,
      wallets,
    });

    await this.emitWalletsInfo();

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
          derivationPath: wallet.derivationPathSpec as DerivationPath,
          authProvider: wallet.authProvider,
          userEmail: wallet.userEmail,
          userId: wallet.userId,
        };
      }

      return {
        id: wallet.id,
        name: wallet.name,
        type: wallet.secretType,
        derivationPath: wallet.derivationPathSpec as DerivationPath,
      };
    });
  }

  async getAvalanchePublicKeys(walletId: string, accountIndex: number) {
    const storedSecrets = await this.getSecretsById(walletId);

    if (!isPrimaryWalletSecrets(storedSecrets)) {
      throw new Error('Cannot fetch public keys for a non-primary wallets');
    }

    const suffixedPath = `${getAvalancheExtendedKeyPath(accountIndex)}/`;

    return storedSecrets.publicKeys.filter(
      ({ derivationPath, curve }) =>
        curve === 'secp256k1' && derivationPath.startsWith(suffixedPath),
    );
  }

  async getAvalancheExtendedPublicKey(walletId: string, accountIndex: number) {
    const storedSecrets = await this.getSecretsById(walletId);

    if (!isPrimaryWalletSecrets(storedSecrets)) {
      throw new Error(
        'Cannot fetch extended public keys for a non-primary wallets',
      );
    }

    if (!('extendedPublicKeys' in storedSecrets)) {
      return undefined;
    }

    const derivationPath = getAvalancheExtendedKeyPath(accountIndex);

    return getExtendedPublicKey(
      storedSecrets.extendedPublicKeys,
      derivationPath,
      'secp256k1',
    );
  }

  async appendPublicKeys(walletId: string, publicKeys: AddressPublicKeyJson[]) {
    const storedSecrets = await this.getSecretsById(walletId);

    if (!isPrimaryWalletSecrets(storedSecrets)) {
      throw new Error('Cannot append public keys to a non-primary wallet');
    }

    const uniqueKeys = uniqWith(
      [...storedSecrets.publicKeys, ...publicKeys],
      (one, other) =>
        one.curve === other.curve &&
        one.derivationPath === other.derivationPath,
    );

    return this.updateSecrets(
      {
        publicKeys: uniqueKeys,
      },
      walletId,
    );
  }

  async updateSecrets(
    secrets: Partial<PrimaryWalletSecrets>,
    walletId: string,
  ): Promise<string | null> {
    const storedSecrets = await this.#loadSecrets(false);

    const existingWallet = storedSecrets?.wallets.find(
      (w) => w.id === walletId,
    );
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
      if (
        existingWallet &&
        typeof secrets.name === 'string' &&
        existingWallet.name !== secrets.name
      ) {
        this.#eventEmitter.emit(WalletEvents.WALLET_NAME_CHANGED, {
          walletId,
          name: secrets.name,
        });
      }

      await this.storageService.save<Partial<WalletSecretInStorage>>('wallet', {
        ...storedSecrets,
        wallets: [...updatedWalletSecrets] as PrimaryWalletSecrets[],
      });
      await this.emitWalletsInfo();
      return walletId;
    }

    return null;
  }

  async deleteSecrets(walletId: string) {
    const storedSecrets = await this.#loadSecrets(false);

    const updatedWalletSecrets = storedSecrets?.wallets.filter(
      (wallet) => wallet.id !== walletId,
    );

    const updatedImportedSecrets = storedSecrets?.importedAccounts;
    if (updatedImportedSecrets) {
      delete updatedImportedSecrets[walletId];
    }
    if (updatedWalletSecrets) {
      await this.storageService.save<Partial<WalletSecretInStorage>>('wallet', {
        ...updatedImportedSecrets,
        wallets: [...updatedWalletSecrets],
      });
    }
    await this.emitWalletsInfo();
  }

  getWalletSecretsForAccount(
    walletKeys: WalletSecretInStorage,
    account: Account,
  ) {
    const activeWalletId = isPrimaryAccount(account)
      ? account.walletId
      : account?.id;

    return walletKeys.wallets.find((wallet) => wallet.id === activeWalletId);
  }

  async getPrimaryAccountSecrets(activeAccount?: Account) {
    if (!activeAccount) {
      return null;
    }
    const walletKeys = await this.#loadSecrets(false);

    if (!walletKeys) {
      return null;
    }
    const activeWalletSecrets = this.getWalletSecretsForAccount(
      walletKeys,
      activeAccount,
    );

    if (!activeWalletSecrets) {
      return null;
    }

    return activeWalletSecrets;
  }

  async getImportedAccountSecrets(
    accountId: string,
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

  async getAccountSecrets(account: Account): Promise<AccountWithSecrets> {
    const walletKeys = await this.#loadSecrets(true);

    if (account.type === AccountType.PRIMARY) {
      const activeWalletSecrets = this.getWalletSecretsForAccount(
        walletKeys,
        account,
      );

      if (!activeWalletSecrets) {
        throw new Error('There is no values for this account');
      }

      return {
        account,
        ...activeWalletSecrets,
      };
    }

    const secrets = await this.getImportedAccountSecrets(account.id);

    return {
      account: account,
      ...secrets,
    };
  }

  async getSecretsById(walletId: string) {
    const tempSecret = this.#temporarySecretStorage.get(walletId);

    if (tempSecret) {
      return tempSecret;
    }

    const secrets = await this.#loadSecrets(true);

    const importedAccountSecrets = secrets.importedAccounts?.[walletId];

    if (importedAccountSecrets) {
      return importedAccountSecrets;
    }

    const primaryWalletSecrets = secrets.wallets.find(
      ({ id }) => id === walletId,
    );

    if (!primaryWalletSecrets) {
      throw new Error('No secrets found for this id');
    }

    return primaryWalletSecrets;
  }

  async getWalletAccountsSecretsById(walletId: string) {
    const walletKeys = await this.#loadSecrets(true);

    const walletSecrets = walletKeys.wallets.find(
      (wallet) => wallet.id === walletId,
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
    ids: string[],
    walletConnectService: WalletConnectService,
  ): Promise<Record<string, ImportedAccountSecrets | undefined>> {
    const { importedAccounts, ...primarySecrets } =
      await this.#loadSecrets(true);

    const deleted = pick(importedAccounts, ids);
    const newImported = omit(importedAccounts, ids);

    await this.storageService.save<WalletSecretInStorage>('wallet', {
      ...primarySecrets,
      importedAccounts: newImported,
    });

    Object.values(deleted).forEach(async (wallet) => {
      if (
        wallet?.secretType === SecretType.WalletConnect ||
        wallet?.secretType === SecretType.Fireblocks
      ) {
        await walletConnectService.deleteSession(wallet.addresses.addressC);
      }
    });

    return deleted;
  }

  async deletePrimaryWallets(ids: string[]): Promise<number> {
    const { wallets, ...importedSecrets } = await this.#loadSecrets(true);

    const newWallets = wallets.filter((wallet) => !ids.includes(wallet.id));
    await this.storageService.save<WalletSecretInStorage>('wallet', {
      ...importedSecrets,
      wallets: newWallets,
    });

    await this.emitWalletsInfo();

    return wallets.length - newWallets.length;
  }

  async saveImportedWallet(id: string, data: ImportedAccountSecrets) {
    const secrets = await this.#loadSecrets(true);

    await this.storageService.save<WalletSecretInStorage>('wallet', {
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
    walletId: string,
    activeAccount: Account,
  ) {
    const secrets = await this.getAccountSecrets(activeAccount);

    if (
      secrets.secretType !== SecretType.Ledger &&
      secrets.secretType !== SecretType.LedgerLive
    ) {
      throw new Error(
        'Error while saving wallet policy details: incorrect wallet type.',
      );
    }

    const { account } = secrets;

    if (secrets.secretType === SecretType.LedgerLive && account) {
      const pubKeyInfo = secrets.publicKeys.find(
        (key) => key.derivationPath === `m/44'/60'/${account.index}'/0/0`,
      );

      if (!pubKeyInfo) {
        throw new Error(
          'Error while saving wallet policy details: missing record for the provided index.',
        );
      }

      if (pubKeyInfo?.btcWalletPolicyDetails) {
        throw new Error(
          'Error while saving wallet policy details: policy details already stored.',
        );
      }

      pubKeyInfo.btcWalletPolicyDetails = {
        xpub,
        masterFingerprint,
        hmacHex,
        name,
      };

      secrets.publicKeys[account.index] = pubKeyInfo;

      return await this.updateSecrets(
        {
          publicKeys: secrets.publicKeys,
        },
        walletId,
      );
    }

    if (secrets.secretType === SecretType.Ledger) {
      const extPubKey = secrets.extendedPublicKeys.find(
        (key) => key.derivationPath === EVM_BASE_DERIVATION_PATH,
      );
      if (!extPubKey) {
        throw new Error('No matching extended public key found');
      }

      if (extPubKey?.btcWalletPolicyDetails) {
        throw new Error(
          'Error while saving wallet policy details: policy details already stored.',
        );
      }

      extPubKey.btcWalletPolicyDetails = {
        xpub,
        masterFingerprint,
        hmacHex,
        name,
      };

      return await this.updateSecrets(
        {
          extendedPublicKeys: secrets.extendedPublicKeys,
        },
        walletId,
      );
    }

    throw new Error(
      'Error while saving wallet policy details: unknown derivation path.',
    );
  }

  async getBtcWalletPolicyDetails(
    account: Account,
  ): Promise<
    { accountIndex: number; details?: BtcWalletPolicyDetails } | undefined
  > {
    if (!account) {
      return undefined;
    }
    const secrets = await this.getAccountSecrets(account);

    if (secrets.secretType === SecretType.LedgerLive && secrets.account) {
      const accountIndex = secrets.account.index;
      const pubKeyInfo = secrets.publicKeys.find(
        (key) => key.derivationPath === `m/44'/60'/${accountIndex}'/0/0`, // TODO: extract as util function
      );

      return {
        accountIndex,
        details: pubKeyInfo?.btcWalletPolicyDetails,
      };
    }

    if (secrets.secretType === SecretType.Ledger) {
      const extPubKey = secrets.extendedPublicKeys.find(
        (key) => key.btcWalletPolicyDetails,
      );

      return {
        accountIndex: 0,
        details: extPubKey?.btcWalletPolicyDetails,
      };
    }
  }

  async loadSecrets() {
    return await this.#loadSecrets(true);
  }

  async #loadSecrets(strict: true): Promise<WalletSecretInStorage | never>;
  async #loadSecrets(strict: false): Promise<WalletSecretInStorage | null>;
  async #loadSecrets(strict: boolean): Promise<WalletSecretInStorage | null> {
    const walletKeys =
      await this.storageService.load<WalletSecretInStorage>('wallet');

    if (!walletKeys && strict) {
      throw new Error('Wallet is not initialized');
    }

    return walletKeys ?? null;
  }

  async isKnownSecret(
    type: SecretType.Mnemonic,
    mnemonic: string,
  ): Promise<IsKnownSecretResult>;
  async isKnownSecret(
    type: SecretType.PrivateKey,
    privateKey: string,
  ): Promise<IsKnownSecretResult>;
  async isKnownSecret(
    type: SecretType.LedgerLive,
    publicKey: string,
  ): Promise<IsKnownSecretResult>;
  async isKnownSecret(
    type: SecretType.Ledger,
    extendedPublicKey: string,
  ): Promise<IsKnownSecretResult>;
  async isKnownSecret(
    type:
      | SecretType.Mnemonic
      | SecretType.PrivateKey
      | SecretType.Ledger
      | SecretType.LedgerLive,
    secret: unknown,
  ): Promise<IsKnownSecretResult>;
  async isKnownSecret(
    type:
      | SecretType.Mnemonic
      | SecretType.PrivateKey
      | SecretType.Ledger
      | SecretType.LedgerLive,
    secret: unknown,
  ): Promise<IsKnownSecretResult> {
    const secrets = await this.#loadSecrets(false);

    if (!secrets) {
      return { isKnown: false };
    }

    if (type === SecretType.Mnemonic) {
      const found = secrets.wallets.find(
        (wallet) =>
          wallet.secretType === SecretType.Mnemonic &&
          wallet.mnemonic === secret,
      );

      return found ? { isKnown: true, name: found.name } : { isKnown: false };
    }

    if (type === SecretType.PrivateKey) {
      if (!secrets.importedAccounts) {
        return { isKnown: false };
      }

      const found = Object.values(secrets.importedAccounts).find(
        (acc) =>
          acc.secretType === SecretType.PrivateKey && acc.secret === secret,
      );

      return found ? { isKnown: true, name: '' } : { isKnown: false };
    }

    if (type === SecretType.Ledger) {
      const found = secrets.wallets.find(
        (wallet) =>
          wallet.secretType === SecretType.Ledger &&
          wallet.extendedPublicKeys.some((pub) => pub.key === secret),
      );

      return found ? { isKnown: true, name: found.name } : { isKnown: false };
    }

    if (type === SecretType.LedgerLive) {
      const found = secrets.wallets.find((wallet) => {
        return (
          wallet.secretType === SecretType.LedgerLive &&
          (wallet.publicKeys.some((pub) => pub.key === secret) ||
            wallet.extendedPublicKeys.some((pub) => pub.key === secret))
        );
      });

      return found ? { isKnown: true, name: found.name } : { isKnown: false };
    }

    throw new Error('Unsupported secret type');
  }

  async getWalletType(id: string) {
    const walletSecrets = await this.getWalletAccountsSecretsById(id);
    return walletSecrets?.secretType;
  }

  async addImportedWallet(
    importData: ImportData,
    addressResolver: AddressResolver,
  ) {
    const id = crypto.randomUUID();

    // let the AccountService validate the account's uniqueness and save the secret using this callback
    const commit = async () => {
      // Need to re-map `data` to `secret` for private key imports
      switch (importData.importType) {
        case ImportType.PRIVATE_KEY:
          await this.saveImportedWallet(id, {
            secretType: SecretType.PrivateKey,
            secret: importData.data,
          });
          break;
        case ImportType.FIREBLOCKS:
          await this.saveImportedWallet(id, {
            secretType: SecretType.Fireblocks,
            ...importData.data,
          });
          break;
        case ImportType.WALLET_CONNECT:
          await this.saveImportedWallet(id, {
            secretType: SecretType.WalletConnect,
            ...importData.data,
          });
          break;
      }
    };

    if (
      importData.importType === ImportType.FIREBLOCKS ||
      importData.importType === ImportType.WALLET_CONNECT
    ) {
      return {
        account: {
          id,
          ...importData.data.addresses,
        },
        commit,
      };
    }

    if (importData.importType === ImportType.PRIVATE_KEY) {
      this.#temporarySecretStorage.set(id, {
        secretType: SecretType.PrivateKey,
        secret: importData.data,
      });

      try {
        const addresses = await addressResolver.getAddressesForSecretId(id);
        return {
          account: {
            id,
            ...mapVMAddresses(addresses),
          },
          commit,
        };
      } finally {
        this.#temporarySecretStorage.delete(id);
      }
    }

    throw new Error('Unknown import type');
  }

  async addAddress({
    index,
    walletId,
    ledgerService,
    addressResolver,
  }: {
    index: number;
    walletId: string;
    ledgerService: LedgerService;
    addressResolver: AddressResolver;
  }): Promise<void> {
    const secrets = await this.getWalletAccountsSecretsById(walletId);

    const derivationPaths = await addressResolver.getDerivationPathsByVM(
      index,
      secrets.derivationPathSpec,
      [
        NetworkVMType.EVM,
        NetworkVMType.AVM,
        NetworkVMType.HVM,
        NetworkVMType.SVM,
      ],
    );
    const derivationPathEVM = derivationPaths[NetworkVMType.EVM];
    const derivationPathAVM = derivationPaths[NetworkVMType.AVM];
    const derivationPathHVM = derivationPaths[NetworkVMType.HVM];
    const derivationPathSVM = derivationPaths[NetworkVMType.SVM];

    const hasEVMPublicKey = hasPublicKeyFor(
      secrets,
      derivationPathEVM,
      'secp256k1',
    );
    const hasAVMPublicKey = hasPublicKeyFor(
      secrets,
      derivationPathAVM,
      'secp256k1',
    );

    if (
      secrets.secretType === SecretType.Seedless &&
      (!hasAVMPublicKey || !hasEVMPublicKey)
    ) {
      const wallet = new SeedlessWallet({
        sessionStorage: new SeedlessTokenStorage(this),
        addressPublicKeys: secrets.publicKeys,
      });

      // Prompt Core Seedless API to derive new keys
      await wallet.addAccount(index);

      // With Seedless, we're always getting the entire collection
      // of derive public keys, so we replace the existing ones
      // instead of appending new ones.
      await this.updateSecrets(
        {
          publicKeys: await wallet.getPublicKeys(),
        },
        walletId,
      );

      return;
    }

    const newPublicKeys: AddressPublicKeyJson[] = [];
    const newExtendedPublicKeys: ExtendedPublicKey[] = [];

    if (
      secrets.secretType === SecretType.LedgerLive ||
      secrets.secretType === SecretType.Ledger
    ) {
      // Adding Solana public keys must be performed via separate flow,
      // as it requires a different app to be enabled on the device.
      if (!hasEVMPublicKey) {
        assertPresent(
          ledgerService.recentTransport,
          LedgerError.TransportNotFound,
        );

        const evmExtPath =
          secrets.secretType === SecretType.LedgerLive
            ? getEvmExtendedKeyPath(index)
            : EVM_BASE_DERIVATION_PATH;

        const existingEvmXpub = secrets.extendedPublicKeys.find(
          (key) =>
            key.derivationPath === evmExtPath && key.curve === 'secp256k1',
        );

        if (existingEvmXpub) {
          newPublicKeys.push(
            AddressPublicKey.fromExtendedPublicKeys(
              [existingEvmXpub],
              'secp256k1',
              derivationPathEVM,
            ).toJSON(),
          );
        } else {
          const evmXpubString = await getLedgerExtendedPublicKey(
            ledgerService.recentTransport,
            false,
            evmExtPath,
          );

          assertPresent(
            evmXpubString,
            LedgerError.NoExtendedPublicKeyReturned,
            `EVM @ ${evmExtPath}`,
          );

          const newEvmXpub: ExtendedPublicKey = {
            type: 'extended-pubkey',
            curve: 'secp256k1',
            derivationPath: evmExtPath,
            key: evmXpubString,
          };

          newExtendedPublicKeys.push(newEvmXpub);
          newPublicKeys.push(
            AddressPublicKey.fromExtendedPublicKeys(
              [newEvmXpub],
              'secp256k1',
              derivationPathEVM,
            ).toJSON(),
          );
        }
      }

      if (!hasAVMPublicKey) {
        assertPresent(
          ledgerService.recentTransport,
          LedgerError.TransportNotFound,
        );

        const existingXPXpub = getAvalancheXPub(secrets, index);

        if (existingXPXpub) {
          newPublicKeys.push(
            AddressPublicKey.fromExtendedPublicKeys(
              [existingXPXpub],
              'secp256k1',
              derivationPathAVM,
            ).toJSON(),
          );
        } else {
          const avalancheXpubPath = getAvalancheExtendedKeyPath(index);
          try {
            const xpXpubString = await getLedgerExtendedPublicKey(
              ledgerService.recentTransport,
              false,
              avalancheXpubPath,
            );

            assertPresent(
              xpXpubString,
              LedgerError.NoExtendedPublicKeyReturned,
              `AVM @ ${avalancheXpubPath}`,
            );

            const newXPXpub: ExtendedPublicKey = {
              type: 'extended-pubkey',
              curve: 'secp256k1',
              derivationPath: avalancheXpubPath,
              key: xpXpubString,
            };

            newExtendedPublicKeys.push(newXPXpub);
            newPublicKeys.push(
              AddressPublicKey.fromExtendedPublicKeys(
                [newXPXpub],
                'secp256k1',
                derivationPathAVM,
              ).toJSON(),
            );
          } catch (error) {
            console.error(error);
            throw error;
          }
        }
      }
    } else if (secrets.secretType === SecretType.Mnemonic) {
      // For mnemonic, we can derive public keys for EVM/Bitcoin, X/P-Chains, HyperVM and Solana
      if (!hasEVMPublicKey) {
        const publicKeyEVM = await AddressPublicKey.fromSeedphrase(
          secrets.mnemonic,
          'secp256k1',
          derivationPathEVM,
        );
        newPublicKeys.push(publicKeyEVM.toJSON());
      }
      if (!hasAVMPublicKey) {
        const publicKeyAVM = await AddressPublicKey.fromSeedphrase(
          secrets.mnemonic,
          'secp256k1',
          derivationPathAVM,
        );
        newPublicKeys.push(publicKeyAVM.toJSON());
      }
      if (!hasPublicKeyFor(secrets, derivationPathHVM, 'ed25519')) {
        const publicKeyHVM = await AddressPublicKey.fromSeedphrase(
          secrets.mnemonic,
          'ed25519',
          derivationPathHVM,
        );
        newPublicKeys.push(publicKeyHVM.toJSON());
      }
      if (!hasPublicKeyFor(secrets, derivationPathSVM, 'ed25519')) {
        const publicKeySVM = await AddressPublicKey.fromSeedphrase(
          secrets.mnemonic,
          'ed25519',
          derivationPathSVM,
        );
        newPublicKeys.push(publicKeySVM.toJSON());
      }

      const avalancheXPubPath = getAvalancheExtendedKeyPath(index);
      const avalancheXPub = getExtendedPublicKey(
        secrets.extendedPublicKeys,
        avalancheXPubPath,
        'secp256k1',
      );
      if (!avalancheXPub) {
        newExtendedPublicKeys.push({
          type: 'extended-pubkey',
          curve: 'secp256k1',
          derivationPath: avalancheXPubPath,
          key: Avalanche.getXpubFromMnemonic(secrets.mnemonic, index),
        });
      }
    } else if (isKeystoneSecrets(secrets)) {
      if (!hasEVMPublicKey) {
        const publicKeyEVM = AddressPublicKey.fromExtendedPublicKeys(
          secrets.extendedPublicKeys,
          'secp256k1',
          derivationPathEVM,
        ).toJSON();
        newPublicKeys.push(publicKeyEVM);
      }

      if (!hasAVMPublicKey && secrets.secretType === SecretType.Keystone3Pro) {
        const existingXPXpub = getAvalancheXPub(secrets, index);

        if (existingXPXpub) {
          newPublicKeys.push(
            AddressPublicKey.fromExtendedPublicKeys(
              secrets.extendedPublicKeys,
              'secp256k1',
              derivationPathAVM,
            ).toJSON(),
          );
        } else {
          // TODO: uncomment when new SDK is released:
          // https://ava-labs.atlassian.net/browse/CP-12875
          // const newXPXpub =
          //   await getAvalancheExtendedPublicKeyFromKeystoneUsb(index);
          // newExtendedPublicKeys.push(newXPXpub);
          // newPublicKeys.push(
          //   AddressPublicKey.fromExtendedPublicKeys(
          //     [newXPXpub],
          //     'secp256k1',
          //     derivationPathAVM,
          //   ).toJSON(),
          // );
        }
      }
    }

    if (newPublicKeys.length > 0 || newExtendedPublicKeys.length > 0) {
      await this.updateSecrets(
        {
          publicKeys: [...secrets.publicKeys, ...newPublicKeys],
          ...('extendedPublicKeys' in secrets
            ? {
                extendedPublicKeys: [
                  ...secrets.extendedPublicKeys,
                  ...newExtendedPublicKeys,
                ],
              }
            : {}),
        },
        walletId,
      );
    }
  }

  async derivePublicKey(
    secretId: string,
    curve: Curve,
    derivationPath?: string,
  ): Promise<string> {
    const secrets = await this.getSecretsById(secretId);

    const pubkey = await AddressPublicKey.fromSecrets(
      secrets,
      curve,
      derivationPath,
    );

    return pubkey.key;
  }
}
