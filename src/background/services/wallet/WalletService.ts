import { EventEmitter } from 'events';
import { container, singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  PubKeyType,
  SignTransactionRequest,
  WALLET_STORAGE_KEY,
  WalletEvents,
  WalletSecretInStorage,
  WalletType,
} from './models';
import { MessageType } from '../messages/models';
import {
  Avalanche,
  BitcoinLedgerWallet,
  BitcoinProviderAbstract,
  BitcoinWallet,
  createWalletPolicy,
  DerivationPath,
  getAddressDerivationPath,
  getAddressFromXPub,
  getAddressPublicKeyFromXPub,
  getBech32AddressFromXPub,
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
  getPublicKeyFromPrivateKey,
  getWalletFromMnemonic,
  JsonRpcBatchInternal,
  LedgerSigner,
} from '@avalabs/wallets-sdk';
import { NetworkService } from '../network/NetworkService';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { LockService } from '../lock/LockService';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import {
  personalSign,
  signTypedData,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { LedgerService } from '../ledger/LedgerService';
import { Wallet } from 'ethers';
import { networks } from 'bitcoinjs-lib';
import { AccountsService } from '../accounts/AccountsService';
import { prepareBtcTxForLedger } from './utils/prepareBtcTxForLedger';
import {
  Account,
  AccountType,
  ImportData,
  ImportType,
  PrimaryAccount,
} from '../accounts/models';
import getDerivationPath from './utils/getDerivationPath';
import ensureMessageIsValid from './utils/ensureMessageFormatIsValid';
import { KeystoneWallet } from '../keystone/KeystoneWallet';
import { KeystoneService } from '../keystone/KeystoneService';
import { BitcoinKeystoneWallet } from '../keystone/BitcoinKeystoneWallet';

@singleton()
export class WalletService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();
  private _walletType?: WalletType;
  private _derivationPath?: DerivationPath;

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private ledgerService: LedgerService,
    private lockService: LockService,
    private keystoneService: KeystoneService
  ) {}

  public get walletType(): WalletType | undefined {
    return this._walletType;
  }

  public get derivationPath(): DerivationPath | undefined {
    return this._derivationPath;
  }

  private emitWalletState() {
    this.eventEmitter.emit(WalletEvents.WALLET_STATE_UPDATE, {
      walletType: this._walletType,
      derivationPath: this._derivationPath,
    });
  }

  async onUnlock(): Promise<void> {
    const walletKeys = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!walletKeys) {
      this.emitWalletState();
      // wallet is not initialized
      return;
    }

    if (walletKeys.mnemonic) {
      this._walletType = WalletType.MNEMONIC;
    } else if (walletKeys.masterFingerprint) {
      this._walletType = WalletType.KEYSTONE;
    } else if (walletKeys.xpub || walletKeys.pubKeys?.length) {
      this._walletType = WalletType.LEDGER;
    } else {
      throw new Error('Wallet initialization failed, no key found');
    }

    this._derivationPath = walletKeys.derivationPath;
    this.emitWalletState();
  }

  /**
   * Called during the onboarding flow.
   * Responsible for saving the mnemonic/pubkey and activating the wallet.
   */
  async init({
    mnemonic,
    xpub,
    xpubXP,
    pubKeys,
    masterFingerprint,
  }: {
    xpub?: string;
    xpubXP?: string;
    pubKeys?: PubKeyType[];
    mnemonic?: string;
    masterFingerprint?: string;
  }) {
    if (!mnemonic && !xpub && !pubKeys?.length) {
      throw new Error('Mnemonic, pubKeys or xpub is required');
    }

    const derivationPath = getDerivationPath({ mnemonic, xpub, pubKeys });

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      mnemonic,
      xpub,
      pubKeys,
      xpubXP,
      derivationPath,
      masterFingerprint,
    });
    await this.onUnlock();
  }

  onLock() {
    this._walletType = undefined;
    this._derivationPath = undefined;
    this.emitWalletState();
  }

  private async getWallet(network?: Network, tabId?: number) {
    const walletKeys = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    // To resolve circular dependencies we are
    // getting accounts service on the fly instead of via constructor
    const accountsService = container.resolve(AccountsService);

    const activeNetwork = network || this.networkService.activeNetwork;
    const activeAccount = accountsService.activeAccount;
    if (
      !walletKeys ||
      (!walletKeys.xpub && !walletKeys.pubKeys) ||
      !activeNetwork ||
      !activeAccount
    ) {
      // wallet is not initialized
      return;
    }

    const provider = this.networkService.getProviderForNetwork(activeNetwork);

    if (activeAccount.type === AccountType.IMPORTED) {
      const importData = walletKeys.imported?.[activeAccount.id];

      if (!importData) {
        throw new Error(
          'Wallet initialization for imported account failed: no data found'
        );
      }

      switch (importData.type) {
        case ImportType.PRIVATE_KEY: {
          if (activeNetwork.vmName === NetworkVMType.EVM) {
            return new Wallet(
              importData.secret,
              provider as JsonRpcBatchInternal
            );
          } else if (activeNetwork.vmName === NetworkVMType.BITCOIN) {
            return new BitcoinWallet(
              Buffer.from(importData.secret, 'hex'),
              provider as BitcoinProviderAbstract
            );
          } else if (
            activeNetwork.vmName === NetworkVMType.AVM ||
            activeNetwork.vmName === NetworkVMType.PVM
          ) {
            // Imported private keys use the same key for both X/P and C
            return new Avalanche.StaticSigner(
              Buffer.from(importData.secret, 'hex'),
              Buffer.from(importData.secret, 'hex'),
              provider as Avalanche.JsonRpcProvider
            );
          }

          throw new Error(
            'Wallet initialization for imported account failed: unsupported network type'
          );
        }
        default: {
          throw new Error(
            'Wallet initialization for imported account failed: unsupported import type'
          );
        }
      }
    }

    if (activeNetwork.vmName === NetworkVMType.EVM) {
      if (walletKeys.masterFingerprint) {
        if (!this.networkService.activeNetwork?.chainId) {
          throw new Error('active network not found');
        }
        return new KeystoneWallet(
          walletKeys.masterFingerprint,
          activeAccount.index,
          this.keystoneService,
          this.networkService.activeNetwork.chainId,
          tabId
        );
      } else if (walletKeys.mnemonic) {
        const wallet = getWalletFromMnemonic(
          walletKeys.mnemonic,
          activeAccount.index,
          DerivationPath.BIP44
        );
        return wallet.connect(provider as JsonRpcBatchInternal);
      } else if (walletKeys.xpub) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new LedgerSigner(
          activeAccount.index,
          this.ledgerService.recentTransport,
          DerivationPath.BIP44, // Extended public keys are always m/44'/60'/0'
          provider as JsonRpcBatchInternal
        );
      } else if (walletKeys.pubKeys?.length) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new LedgerSigner(
          activeAccount.index,
          this.ledgerService.recentTransport,
          DerivationPath.LedgerLive, // Use LedgerLive derivation paths for address public keys (m/44'/60'/n'/0/0) in storage
          provider as JsonRpcBatchInternal
        );
      }
    } else if (activeNetwork.vmName === NetworkVMType.BITCOIN) {
      if (walletKeys.masterFingerprint && walletKeys.xpub) {
        // Use BIP44 derivation paths for extended public key of m/44'/60'/0'
        const addressPublicKey = getAddressPublicKeyFromXPub(
          walletKeys.xpub,
          activeAccount.index
        );

        return new BitcoinKeystoneWallet(
          walletKeys.masterFingerprint,
          addressPublicKey,
          getAddressDerivationPath(
            activeAccount.index,
            DerivationPath.BIP44,
            'EVM'
          ),
          this.keystoneService,
          provider as BitcoinProviderAbstract,
          tabId
        );
      } else if (walletKeys.mnemonic) {
        return await BitcoinWallet.fromMnemonic(
          walletKeys.mnemonic,
          activeAccount.index,
          provider as BitcoinProviderAbstract
        );
      } else if (walletKeys.xpub) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const walletPolicy = await this.parseWalletPolicyDetails(activeAccount);

        // Use BIP44 derivation paths for extended public key of m/44'/60'/0'
        const addressPublicKey = getAddressPublicKeyFromXPub(
          walletKeys.xpub,
          activeAccount.index
        );

        return new BitcoinLedgerWallet(
          addressPublicKey,
          getAddressDerivationPath(
            activeAccount.index,
            DerivationPath.BIP44,
            'EVM'
          ),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy
        );
      } else if (walletKeys.pubKeys?.length) {
        // Use LedgerLive derivation paths for address public keys (m/44'/60'/n'/0/0) in storage
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const addressPublicKey = walletKeys.pubKeys[activeAccount.index];

        if (!addressPublicKey) {
          throw new Error('Account public key not available');
        }

        const walletPolicy = await this.parseWalletPolicyDetails(activeAccount);

        return new BitcoinLedgerWallet(
          Buffer.from(addressPublicKey.evm, 'hex'),
          getAddressDerivationPath(
            activeAccount.index,
            DerivationPath.LedgerLive,
            'EVM'
          ),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy
        );
      }
    } else if (
      activeNetwork.vmName === NetworkVMType.AVM ||
      activeNetwork.vmName === NetworkVMType.PVM
    ) {
      // Return X/P Wallet
      const accountIndex = activeAccount.index;

      if (walletKeys.mnemonic) {
        return new Avalanche.SimpleSigner(walletKeys.mnemonic, accountIndex);
      } else if (walletKeys.xpub && walletKeys.xpubXP) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new Avalanche.SimpleLedgerSigner(
          accountIndex,
          provider as Avalanche.JsonRpcProvider,
          walletKeys.xpubXP
        );
      } else if (walletKeys.pubKeys?.length) {
        // Ledger signing with LedgerLive derivaiton paths
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const pubkey = walletKeys.pubKeys[accountIndex];

        if (!pubkey)
          throw new Error('Can not find public key for the active account');

        // Verify public key exists for X/P path
        if (!pubkey.xp) throw new Error('X/P Chain public key is not set');

        // TODO: SimpleLedgerSigner doesn't support LedgerLive derivation paths ATM
        // https://ava-labs.atlassian.net/browse/CP-5861
        return new Avalanche.LedgerSigner(
          Buffer.from(pubkey.xp, 'hex'),
          getAddressDerivationPath(
            accountIndex,
            DerivationPath.LedgerLive,
            'AVM'
          ),
          Buffer.from(pubkey.evm, 'hex'),
          getAddressDerivationPath(
            accountIndex,
            DerivationPath.LedgerLive,
            'EVM'
          ),
          provider as Avalanche.JsonRpcProvider
        );
      }
    } else {
      throw new Error('Wallet initialization failed unsupported network type');
    }

    throw new Error('Wallet initialization failed missing keys');
  }

  async getMnemonic(password: string) {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );
    const validPassword = await this.lockService.verifyPassword(password);

    if (!validPassword) {
      throw new Error('Password invalid');
    }

    if (!secrets?.mnemonic) {
      throw new Error('Not a MnemonicWallet');
    }

    return secrets.mnemonic;
  }

  async sign(
    tx: SignTransactionRequest,
    tabId?: number,
    network?: Network
  ): Promise<string> {
    const wallet = await this.getWallet(network, tabId);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // handle BTC signing
    if ('inputs' in tx) {
      if (
        !(wallet instanceof BitcoinWallet) &&
        !(wallet instanceof BitcoinLedgerWallet) &&
        !(wallet instanceof BitcoinKeystoneWallet)
      ) {
        throw new Error('Signing error, wrong network');
      }

      // prepare transaction for ledger signing
      const txToSign =
        wallet instanceof BitcoinLedgerWallet
          ? await prepareBtcTxForLedger(
              tx,
              await this.networkService.getBitcoinProvider()
            )
          : tx;

      const signedTx = await wallet.signTx(txToSign.inputs, txToSign.outputs);
      return signedTx.toHex();
    }

    // Handle Avalanche signing, X/P/CoreEth
    if ('tx' in tx) {
      if (
        !(wallet instanceof Avalanche.SimpleSigner) &&
        !(wallet instanceof Avalanche.StaticSigner) &&
        !(wallet instanceof Avalanche.SimpleLedgerSigner) &&
        !(wallet instanceof Avalanche.LedgerSigner)
      ) {
        throw new Error('Signing error, wrong network');
      }
      const unsignedTx = await wallet.signTx({
        tx: tx.tx,
        ...((wallet instanceof Avalanche.SimpleLedgerSigner ||
          wallet instanceof Avalanche.LedgerSigner) && {
          transport: this.ledgerService.recentTransport,
        }),
        externalIndices: tx.externalIndices,
        internalIndices: tx.internalIndices,
      });

      return JSON.stringify(unsignedTx.toJSON());
    }

    if (
      !(wallet instanceof Wallet) &&
      !(wallet instanceof LedgerSigner) &&
      !(wallet instanceof KeystoneWallet)
    ) {
      throw new Error('Signing error, wrong network');
    }

    return await wallet.signTransaction(tx);
  }

  /**
   * Get the public key of an account index
   * @throws Will throw error for LedgerLive accounts that have not been added yet.
   * @param index Account index to get public key of.
   */
  async getPublicKey(account: Account): Promise<PubKeyType> {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (account.type === AccountType.IMPORTED) {
      const secretEntry = secrets?.imported?.[account.id];

      if (!secretEntry) {
        throw new Error(
          'Can not find public key for the given imported account'
        );
      }

      if (secretEntry.type === ImportType.PRIVATE_KEY) {
        const publicKey = getPublicKeyFromPrivateKey(
          secretEntry.secret
        ).toString('hex');

        return {
          evm: publicKey,
          xp: publicKey,
        };
      }

      throw new Error('Unable to get public key');
    }

    if (secrets?.xpub && secrets?.xpubXP) {
      const evmPub = getAddressPublicKeyFromXPub(secrets.xpub, account.index);
      const xpPub = Avalanche.getAddressPublicKeyFromXpub(
        secrets.xpubXP,
        account.index
      );
      return {
        evm: evmPub.toString('hex'),
        xp: xpPub.toString('hex'),
      };
    } else if (secrets?.pubKeys) {
      const pub = secrets.pubKeys[account.index];
      if (!pub) throw new Error('Can not find public key for the given index');
      return {
        evm: pub.evm,
        xp: pub.xp,
      };
    }

    throw new Error('Unable to get public key');
  }

  async signMessage(messageType: MessageType, data: any) {
    const wallet = await this.getWallet();
    const activeNetwork = this.networkService.activeNetwork;

    if (!wallet || !(wallet instanceof Wallet)) {
      throw new Error(
        wallet
          ? `this function not supported on your wallet`
          : 'wallet undefined in sign tx'
      );
    }

    if (!activeNetwork) {
      throw new Error(`no active network found`);
    }

    const privateKey = wallet.privateKey.toLowerCase().startsWith('0x')
      ? wallet.privateKey.slice(2)
      : wallet.privateKey;

    const key = Buffer.from(privateKey, 'hex');

    try {
      if (data) {
        ensureMessageIsValid(messageType, data, activeNetwork.chainId);

        switch (messageType) {
          case MessageType.ETH_SIGN:
          case MessageType.PERSONAL_SIGN:
            return personalSign({ privateKey: key, data });
          case MessageType.SIGN_TYPED_DATA:
          case MessageType.SIGN_TYPED_DATA_V1:
            return signTypedData({
              privateKey: key,
              data,
              version: SignTypedDataVersion.V1,
            });
          case MessageType.SIGN_TYPED_DATA_V3:
            return signTypedData({
              privateKey: key,
              data,
              version: SignTypedDataVersion.V3,
            });
          case MessageType.SIGN_TYPED_DATA_V4:
            return signTypedData({
              privateKey: key,
              data,
              version: SignTypedDataVersion.V4,
            });
          default:
            throw new Error('unknown method');
        }
      } else {
        throw new Error('no message to sign');
      }
    } finally {
      key.fill(0);
    }
  }

  addListener(event: WalletEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }

  async addAddress(index: number): Promise<Record<NetworkVMType, string>> {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (
      !secrets?.mnemonic &&
      !secrets?.xpub &&
      secrets?.pubKeys &&
      !secrets.pubKeys[index]
    ) {
      // Since we don't have xPub or Mnemonic we need to get the new address pubkey from the Ledger
      if (!this.ledgerService.recentTransport) {
        throw new Error('Ledger transport not available');
      }

      // Get EVM public key from transport
      const addressPublicKeyC = await getPubKeyFromTransport(
        this.ledgerService.recentTransport,
        index,
        DerivationPath.LedgerLive
      );

      // Get X/P public key from transport
      const addressPublicKeyXP = await getPubKeyFromTransport(
        this.ledgerService.recentTransport,
        index,
        DerivationPath.LedgerLive,
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

      await this.storageService.save<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        {
          ...secrets,
          pubKeys,
        }
      );
    }

    return this.getAddresses(index);
  }

  async getAddresses(index: number): Promise<Record<NetworkVMType, string>> {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    const isMainnet = this.networkService.isMainnet();

    // Avalanche XP Provider
    const provXP = await this.networkService.getAvalanceProviderXP();

    if (secrets?.xpub) {
      // C-avax... this address uses the same public key as EVM
      const cPubkey = getAddressPublicKeyFromXPub(secrets.xpub, index);
      const cAddr = provXP.getAddress(cPubkey, 'C');

      let xAddr, pAddr;
      // We can only get X/P addresses if xpubXP is set
      if (secrets.xpubXP) {
        // X and P addresses different derivation path m/44'/9000'/0'...
        const xpPub = Avalanche.getAddressPublicKeyFromXpub(
          secrets.xpubXP,
          index
        );
        xAddr = provXP.getAddress(xpPub, 'X');
        pAddr = provXP.getAddress(xpPub, 'P');
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
    } else if (secrets?.pubKeys) {
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
        addrX = provXP.getAddress(pubKeyBufferXP, 'X');
        addrP = provXP.getAddress(pubKeyBufferXP, 'P');
      }

      return {
        [NetworkVMType.EVM]: getEvmAddressFromPubKey(pubKeyBuffer),
        [NetworkVMType.BITCOIN]: getBtcAddressFromPubKey(
          pubKeyBuffer,
          isMainnet ? networks.bitcoin : networks.testnet
        ),
        [NetworkVMType.AVM]: addrX,
        [NetworkVMType.PVM]: addrP,
        [NetworkVMType.CoreEth]: provXP.getAddress(pubKeyBuffer, 'C'),
      };
    }

    throw new Error('No public key available');
  }

  async getAddressesByIndices(
    indices: number[],
    chainAlias: 'X' | 'P',
    isChange: boolean
  ) {
    const provXP = await this.networkService.getAvalanceProviderXP();
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!secrets?.xpubXP) {
      return [];
    }

    if (isChange && chainAlias !== 'X') {
      return [];
    }

    return indices.map((index) =>
      Avalanche.getAddressFromXpub(
        secrets.xpubXP as string,
        index,
        provXP,
        chainAlias,
        isChange
      )
    );
  }

  async getAddressesInRange(
    externalStart: number,
    internalStart: number,
    externalLimit?: number,
    internalLimit?: number
  ) {
    if (
      isNaN(externalStart) ||
      externalStart < 0 ||
      isNaN(internalStart) ||
      internalStart < 0
    ) {
      throw new Error('Invalid start index');
    }

    const getCorrectedLimit = (limit?: number) => {
      const MAX_LIMIT = 100;

      if (limit === undefined || isNaN(limit)) {
        return 0;
      }

      return limit > MAX_LIMIT ? MAX_LIMIT : limit;
    };

    const correctedExternalLimit = getCorrectedLimit(externalLimit);
    const correctedInternalLimit = getCorrectedLimit(internalLimit);
    const provXP = await this.networkService.getAvalanceProviderXP();
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    const addresses: { external: string[]; internal: string[] } = {
      external: [],
      internal: [],
    };

    if (secrets?.xpubXP) {
      if (correctedExternalLimit > 0) {
        for (
          let index = externalStart;
          index < externalStart + correctedExternalLimit;
          index++
        ) {
          addresses.external.push(
            Avalanche.getAddressFromXpub(
              secrets.xpubXP,
              index,
              provXP,
              'X'
            ).split('-')[1] as string // since addresses are the same for X/P we return them without the chain alias prefix (e.g.: fuji1jsduya7thx2ayrawf9dnw7v9jz7vc6xjycra2m)
          );
        }
      }

      if (correctedInternalLimit > 0) {
        for (
          let index = internalStart;
          index < internalStart + correctedInternalLimit;
          index++
        ) {
          addresses.internal.push(
            Avalanche.getAddressFromXpub(
              secrets.xpubXP,
              index,
              provXP,
              'X',
              true
            ).split('-')[1] as string // only X has "internal" (change) addresses, but we remove the chain alias here as well to make it consistent with the external address list
          );
        }
      }
    }

    return addresses;
  }

  async addImportedWallet(importData: ImportData) {
    const addresses = this.calculateImportedAddresses(importData);
    const id = crypto.randomUUID();
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!secrets) {
      throw new Error('Error while importing wallet: storage is empty.');
    }

    // let the AccountService validate the account's uniqueness and save the secret using this callback
    const commit = async () =>
      this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
        ...secrets,
        imported: {
          ...secrets?.imported,
          [id]: {
            type: importData.importType,
            secret: importData.data,
          },
        },
      });

    return { account: { id, ...addresses }, commit };
  }

  async getImportedAddresses(id: string) {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    const importData = secrets?.imported?.[id];

    if (!importData) {
      throw new Error(
        'Could not find an imported account with the provided identifier'
      );
    }

    return this.calculateImportedAddresses({
      importType: importData.type,
      data: importData.secret,
    });
  }

  private calculateImportedAddresses({ importType, data }: ImportData) {
    const addresses = {
      addressBTC: '',
      addressC: '',
      addressAVM: '',
      addressPVM: '',
      addressCoreEth: '',
    };

    const isMainnet = this.networkService.isMainnet();
    const provXP = isMainnet
      ? Avalanche.JsonRpcProvider.getDefaultMainnetProvider()
      : Avalanche.JsonRpcProvider.getDefaultFujiProvider();

    switch (importType) {
      case ImportType.PRIVATE_KEY: {
        try {
          const publicKey = getPublicKeyFromPrivateKey(data);
          addresses.addressC = getEvmAddressFromPubKey(publicKey);
          addresses.addressBTC = getBtcAddressFromPubKey(
            publicKey,
            isMainnet ? networks.bitcoin : networks.testnet
          );
          addresses.addressAVM = provXP.getAddress(publicKey, 'X');
          addresses.addressPVM = provXP.getAddress(publicKey, 'P');
          addresses.addressCoreEth = provXP.getAddress(publicKey, 'C');
          break;
        } catch (err) {
          throw new Error('Error while calculating addresses');
        }
      }
      default:
        throw new Error(`Unsupported import type ${importType}`);
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

  async deleteImportedWallets(ids: string[]) {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!secrets) {
      throw new Error(
        'Error while deleting imported wallet: storage is empty.'
      );
    }

    const newImportedSecrets = ids.reduce(
      (importedSecrets, id) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...restOfSecrets } = importedSecrets;
        return restOfSecrets ?? {};
      },
      { ...(secrets.imported ?? {}) }
    );

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      ...secrets,
      imported: {
        ...newImportedSecrets,
      },
    });
  }

  // Attempts to update the existing pubKey records where the XP public key is missing
  async migrateMissingXPPublicKeys() {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!secrets) {
      throw new Error(
        'Error while searching for missing public keys: storage is empty.'
      );
    }

    // nothing to migrate, exit early
    if (this.walletType !== WalletType.LEDGER) {
      return;
    }

    const transport = this.ledgerService.recentTransport;

    if (!transport) {
      throw new Error('Ledger transport not available');
    }

    if (this.derivationPath === DerivationPath.BIP44) {
      // nothing to update, exit early
      if (secrets.xpubXP) {
        return;
      }

      const xpubXP = await getLedgerExtendedPublicKey(
        transport,
        false,
        Avalanche.LedgerWallet.getAccountPath('X')
      );

      await this.storageService.save<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        {
          ...secrets,
          xpubXP,
        }
      );
    } else if (this.derivationPath === DerivationPath.LedgerLive) {
      const hasMissingXPPublicKey = (secrets.pubKeys ?? []).some(
        (pubKey) => !pubKey.xp
      );

      // nothing to migrate, exit early
      if (!hasMissingXPPublicKey) {
        return;
      }

      const migrationResult: {
        updatedPubKeys: PubKeyType[];
        hasError: boolean;
      } = {
        updatedPubKeys: [],
        hasError: false,
      };

      for (const [index, pubKey] of (secrets.pubKeys ?? []).entries()) {
        if (!pubKey.xp) {
          try {
            const addressPublicKeyXP = await getPubKeyFromTransport(
              transport,
              index,
              DerivationPath.LedgerLive,
              'AVM'
            );

            migrationResult.updatedPubKeys.push({
              ...pubKey,
              xp: addressPublicKeyXP.toString('hex'),
            });
          } catch (err) {
            migrationResult.updatedPubKeys.push(pubKey);
            migrationResult.hasError = true;
          }
        } else {
          migrationResult.updatedPubKeys.push(pubKey);
        }
      }

      await this.storageService.save<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        {
          ...secrets,
          pubKeys: migrationResult.updatedPubKeys,
        }
      );

      if (migrationResult.hasError) {
        throw new Error(
          'Error while searching for missing public keys: incomplete migration.'
        );
      }
    }
  }

  private async parseWalletPolicyDetails(account?: Account) {
    const btcWalletPolicyDetails = await this.getBtcWalletPolicyDetails(
      account
    );

    if (!btcWalletPolicyDetails) {
      throw new Error('Error while parsing wallet policy: missing data.');
    }

    const accountIndex =
      this.derivationPath === DerivationPath.LedgerLive
        ? (account as PrimaryAccount).index
        : 0;
    const hmac = Buffer.from(btcWalletPolicyDetails.hmacHex, 'hex');
    const policy = createWalletPolicy(
      btcWalletPolicyDetails.masterFingerprint,
      accountIndex,
      btcWalletPolicyDetails.xpub,
      btcWalletPolicyDetails.name
    );

    return {
      hmac,
      policy,
    };
  }

  async getBtcWalletPolicyDetails(account?: Account) {
    if (
      !account ||
      account.type !== AccountType.PRIMARY ||
      this.walletType !== WalletType.LEDGER
    ) {
      return;
    }

    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (this.derivationPath === DerivationPath.LedgerLive) {
      const pubKeyInfo = (secrets?.pubKeys ?? [])[account.index];
      return pubKeyInfo?.btcWalletPolicyDetails;
    } else if (this.derivationPath === DerivationPath.BIP44) {
      return secrets?.btcWalletPolicyDetails;
    }
  }

  async storeBtcWalletPolicyDetails(
    accountIndex: number,
    xpub: string,
    masterFingerprint: string,
    hmacHex: string,
    name: string
  ) {
    if (this.walletType !== WalletType.LEDGER) {
      throw new Error(
        'Error while saving wallet policy details: incorrect wallet type.'
      );
    }

    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!secrets) {
      throw new Error(
        'Error while saving wallet policy details: storage is empty.'
      );
    }

    if (this.derivationPath === DerivationPath.LedgerLive) {
      const pubKeys = secrets.pubKeys ?? [];
      const pubKeyInfo = pubKeys[accountIndex];

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

      pubKeys[accountIndex] = pubKeyInfo;

      await this.storageService.save<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        {
          ...secrets,
          pubKeys,
        }
      );
    } else if (this.derivationPath === DerivationPath.BIP44) {
      if (secrets?.btcWalletPolicyDetails) {
        throw new Error(
          'Error while saving wallet policy details: policy details already stored.'
        );
      }

      await this.storageService.save<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        {
          ...secrets,
          btcWalletPolicyDetails: {
            xpub,
            masterFingerprint,
            hmacHex,
            name,
          },
        }
      );
    } else {
      throw new Error(
        'Error while saving wallet policy details: unknown derivation path.'
      );
    }
  }
}
