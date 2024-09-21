import { omit, pick } from 'lodash';
import { singleton } from 'tsyringe';

import {
  Account,
  AccountType,
  ImportData,
  ImportType,
} from '../accounts/models';
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
import {
  Avalanche,
  getAddressFromXPub,
  getAddressPublicKeyFromXPub,
  getBech32AddressFromXPub,
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPubKeyFromTransport,
  getPublicKeyFromPrivateKey,
} from '@avalabs/core-wallets-sdk';
import { networks } from 'bitcoinjs-lib';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { SeedlessWallet } from '../seedless/SeedlessWallet';
import { SeedlessTokenStorage } from '../seedless/SeedlessTokenStorage';
import { LedgerService } from '../ledger/LedgerService';
import { NetworkService } from '../network/NetworkService';
import { WalletConnectService } from '../walletConnect/WalletConnectService';

/**
 * Use this service to fetch, save or delete account secrets.
 */
@singleton()
export class SecretsService {
  constructor(private storageService: StorageService) {}

  async #getDefaultName(secrets: AddPrimaryWalletSecrets) {
    const defaultNames = {
      [SecretType.Mnemonic]: 'Recovery Phrase',
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
          userId: wallet.userId,
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

  getActiveWalletSecrets(
    walletKeys: WalletSecretInStorage,
    activeAccount: Account
  ) {
    const activeWalletId = isPrimaryAccount(activeAccount)
      ? activeAccount.walletId
      : activeAccount?.id;

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
    const activeWalletSecrets = this.getActiveWalletSecrets(
      walletKeys,
      activeAccount
    );

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

  async getActiveAccountSecrets(activeAccount: Account) {
    const walletKeys = await this.#loadSecrets(true);

    if (!activeAccount || activeAccount.type === AccountType.PRIMARY) {
      const activeWalletSecrets = this.getActiveWalletSecrets(
        walletKeys,
        activeAccount
      );

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
    ids: string[],
    walletConnectService: WalletConnectService
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
    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      ...importedSecrets,
      wallets: newWallets,
    });

    return wallets.length - newWallets.length;
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
    walletId: string,
    activeAccount: Account
  ) {
    const secrets = await this.getActiveAccountSecrets(activeAccount);

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

  async getBtcWalletPolicyDetails(
    activeAccount?: Account
  ): Promise<
    { accountIndex: number; details?: BtcWalletPolicyDetails } | undefined
  > {
    if (!activeAccount) {
      return undefined;
    }
    const secrets = await this.getActiveAccountSecrets(activeAccount);

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

  async loadSecrets() {
    return await this.#loadSecrets(true);
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

  async getWalletType(id: string) {
    const walletSecrets = await this.getWalletAccountsSecretsById(id);
    return walletSecrets?.secretType;
  }

  async addImportedWallet(importData: ImportData, isMainnet: boolean) {
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
      return {
        account: {
          id,
          ...this.#calculateAddressesForPrivateKey(importData.data, isMainnet),
        },
        commit,
      };
    }

    throw new Error('Unknown import type');
  }

  #calculateAddressesForPrivateKey(privateKey: string, isMainnet: boolean) {
    const addresses = {
      addressBTC: '',
      addressC: '',
      addressAVM: '',
      addressPVM: '',
      addressCoreEth: '',
    };

    const provXP = isMainnet
      ? Avalanche.JsonRpcProvider.getDefaultMainnetProvider()
      : Avalanche.JsonRpcProvider.getDefaultFujiProvider();

    try {
      const publicKey = getPublicKeyFromPrivateKey(privateKey);
      addresses.addressC = getEvmAddressFromPubKey(publicKey);
      addresses.addressBTC = getBtcAddressFromPubKey(
        publicKey,
        isMainnet ? networks.bitcoin : networks.testnet
      );
      addresses.addressAVM = provXP.getAddress(publicKey, 'X');
      addresses.addressPVM = provXP.getAddress(publicKey, 'P');
      addresses.addressCoreEth = provXP.getAddress(publicKey, 'C');
    } catch (err) {
      throw new Error('Error while calculating addresses');
    }

    if (
      !addresses.addressC ||
      !addresses.addressBTC ||
      !addresses.addressAVM ||
      !addresses.addressPVM ||
      !addresses.addressCoreEth
    ) {
      throw new Error(`Missing address`);
    }

    return addresses;
  }

  async addAddress({
    index,
    walletId,
    ledgerService,
    networkService,
  }: {
    index: number;
    walletId: string;
    ledgerService: LedgerService;
    networkService: NetworkService;
  }): Promise<Record<NetworkVMType, string>> {
    const secrets = await this.getWalletAccountsSecretsById(walletId);

    if (
      secrets.secretType === SecretType.LedgerLive &&
      !secrets.pubKeys[index]
    ) {
      // With LedgerLive, we don't have xPub or Mnemonic, so we need
      // to get the new address pubkey from the Ledger device.
      if (!ledgerService.recentTransport) {
        throw new Error('Ledger transport not available');
      }

      // Get EVM public key from transport
      const addressPublicKeyC = await getPubKeyFromTransport(
        ledgerService.recentTransport,
        index,
        secrets.derivationPath
      );

      // Get X/P public key from transport
      const addressPublicKeyXP = await getPubKeyFromTransport(
        ledgerService.recentTransport,
        index,
        secrets.derivationPath,
        'AVM'
      );

      if (
        !addressPublicKeyC ||
        !addressPublicKeyC.byteLength ||
        !addressPublicKeyXP ||
        !addressPublicKeyXP.byteLength
      ) {
        throw new Error('Failed to get public key from device.');
      }

      const pubKeys = [...(secrets?.pubKeys || [])];
      pubKeys[index] = {
        evm: addressPublicKeyC.toString('hex'),
        xp: addressPublicKeyXP.toString('hex'),
      };

      await this.updateSecrets(
        {
          pubKeys,
        },
        walletId
      );
    }

    if (secrets.secretType === SecretType.Seedless && !secrets.pubKeys[index]) {
      const wallet = new SeedlessWallet({
        networkService,
        sessionStorage: new SeedlessTokenStorage(this),
        addressPublicKey: secrets.pubKeys[0],
      });

      // Prompt Core Seedless API to derive new keys
      await wallet.addAccount(index);
      // Update the public keys in wallet
      await this.updateSecrets(
        {
          pubKeys: await wallet.getPublicKeys(),
        },
        walletId
      );
    }

    return this.getAddresses(index, walletId, networkService);
  }

  async getAddresses(
    index: number,
    walletId: string,
    networkService: NetworkService
  ): Promise<Record<NetworkVMType, string> | never> {
    if (!walletId) {
      throw new Error('Wallet id not provided');
    }

    const secrets = await this.getWalletAccountsSecretsById(walletId);

    if (!secrets) {
      throw new Error('Wallet is not initialized');
    }

    const isMainnet = networkService.isMainnet();
    const providerXP = await networkService.getAvalanceProviderXP();

    if (
      secrets.secretType === SecretType.Ledger ||
      secrets.secretType === SecretType.Mnemonic ||
      secrets.secretType === SecretType.Keystone
    ) {
      // C-avax... this address uses the same public key as EVM
      const cPubkey = getAddressPublicKeyFromXPub(secrets.xpub, index);
      const cAddr = providerXP.getAddress(cPubkey, 'C');

      let xAddr, pAddr;
      // We can only get X/P addresses if xpubXP is set
      if (secrets.xpubXP) {
        // X and P addresses different derivation path m/44'/9000'/0'...
        const xpPub = Avalanche.getAddressPublicKeyFromXpub(
          secrets.xpubXP,
          index
        );
        xAddr = providerXP.getAddress(xpPub, 'X');
        pAddr = providerXP.getAddress(xpPub, 'P');
      }

      return {
        [NetworkVMType.EVM]: getAddressFromXPub(secrets.xpub, index),
        [NetworkVMType.BITCOIN]: getBech32AddressFromXPub(
          secrets.xpub,
          index,
          isMainnet ? networks.bitcoin : networks.testnet
        ),
        [NetworkVMType.AVM]: xAddr,
        [NetworkVMType.PVM]: pAddr,
        [NetworkVMType.CoreEth]: cAddr,
      };
    }

    if (
      secrets.secretType === SecretType.LedgerLive ||
      secrets.secretType === SecretType.Seedless
    ) {
      // pubkeys are used for LedgerLive derivation paths m/44'/60'/n'/0/0
      // and for X/P derivation paths  m/44'/9000'/n'/0/0
      const addressPublicKey = secrets.pubKeys[index];

      if (!addressPublicKey?.evm) {
        throw new Error('Account not added');
      }

      const pubKeyBuffer = Buffer.from(addressPublicKey.evm, 'hex');

      // X/P addresses use a different public key because derivation path is different
      let addrX, addrP;
      if (addressPublicKey.xp) {
        const pubKeyBufferXP = Buffer.from(addressPublicKey.xp, 'hex');
        addrX = providerXP.getAddress(pubKeyBufferXP, 'X');
        addrP = providerXP.getAddress(pubKeyBufferXP, 'P');
      }

      return {
        [NetworkVMType.EVM]: getEvmAddressFromPubKey(pubKeyBuffer),
        [NetworkVMType.BITCOIN]: getBtcAddressFromPubKey(
          pubKeyBuffer,
          isMainnet ? networks.bitcoin : networks.testnet
        ),
        [NetworkVMType.AVM]: addrX,
        [NetworkVMType.PVM]: addrP,
        [NetworkVMType.CoreEth]: providerXP.getAddress(pubKeyBuffer, 'C'),
      };
    }

    throw new Error('No public key available');
  }

  async getImportedAddresses(id: string, isMainnet: boolean) {
    const secrets = await this.getImportedAccountSecrets(id);

    if (
      secrets.secretType === SecretType.WalletConnect ||
      secrets.secretType === SecretType.Fireblocks
    ) {
      return secrets.addresses;
    }

    if (secrets.secretType === SecretType.PrivateKey) {
      return this.#calculateAddressesForPrivateKey(secrets.secret, isMainnet);
    }

    throw new Error('Unsupported import type');
  }
}
