import { EventEmitter } from 'events';
import { container, singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  PubKeyType,
  SignTransactionRequest,
  WalletEvents,
  WalletSecretInStorage,
  WalletType,
  WALLET_STORAGE_KEY,
} from './models';
import { MessageType } from '../messages/models';
import {
  BitcoinLedgerWallet,
  BitcoinProviderAbstract,
  BitcoinWallet,
  DerivationPath,
  getAddressDerivationPath,
  getAddressFromXPub,
  getAddressPublicKeyFromXPub,
  getBech32AddressFromXPub,
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPubKeyFromTransport,
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

@singleton()
export class WalletService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();
  private _walletType?: WalletType;
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private ledgerService: LedgerService,
    private lockService: LockService
  ) {}

  public get walletType(): WalletType | undefined {
    return this._walletType;
  }

  async onUnlock(): Promise<void> {
    const walletKeys = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!walletKeys) {
      // wallet is not initialized

      return;
    }

    if (walletKeys.mnemonic) {
      this._walletType = WalletType.MNEMONIC;
    } else if (walletKeys.xpub || walletKeys.pubKeys?.length) {
      this._walletType = WalletType.LEDGER;
    } else {
      throw new Error('Wallet initialization failed, no key found');
    }
  }

  /**
   * Called during the onboarding flow.
   * Responsible for saving the mnemonic/pubkey and activating the wallet.
   */
  async init({
    mnemonic,
    xpub,
    pubKeys,
  }: {
    xpub?: string;
    pubKeys?: PubKeyType[];
    mnemonic?: string;
  }) {
    if (!mnemonic && !xpub && !pubKeys?.length) {
      throw new Error('Mnemonic, pubKeys or xpub is required');
    }

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      mnemonic,
      xpub,
      pubKeys,
    });
    await this.onUnlock();
  }

  onLock() {
    this._walletType = undefined;
    this.eventEmitter.emit(WalletEvents.WALLET_STATE_UPDATE, { locked: true });
  }

  private async getWallet(network?: Network) {
    const walletKeys = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    // To resolve circular dependencies we are
    // getting accounts service on the fly instead of via constructor
    const accountsService = container.resolve(AccountsService);

    const activeNetwork =
      network || (await this.networkService.activeNetwork.promisify());

    if (
      !walletKeys ||
      (!walletKeys.xpub && !walletKeys.pubKeys) ||
      !activeNetwork ||
      !accountsService?.activeAccount
    ) {
      // wallet is not initialized
      return;
    }
    const provider = this.networkService.getProviderForNetwork(activeNetwork);
    if (activeNetwork.vmName === NetworkVMType.EVM) {
      if (walletKeys.mnemonic) {
        const wallet = getWalletFromMnemonic(
          walletKeys.mnemonic,
          accountsService.activeAccount.index,
          DerivationPath.BIP44
        );
        return wallet.connect(provider as JsonRpcBatchInternal);
      } else if (walletKeys.xpub) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new LedgerSigner(
          accountsService.activeAccount.index,
          this.ledgerService.recentTransport,
          DerivationPath.BIP44, // Extended public keys are always m/44'/60'/0'
          provider as JsonRpcBatchInternal
        );
      } else if (walletKeys.pubKeys?.length) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new LedgerSigner(
          accountsService.activeAccount.index,
          this.ledgerService.recentTransport,
          DerivationPath.LedgerLive, // Use LedgerLive derivation paths for address public keys (m/44'/60'/n'/0/0) in storage
          provider as JsonRpcBatchInternal
        );
      }
    } else if (activeNetwork.vmName === NetworkVMType.BITCOIN) {
      if (walletKeys.mnemonic) {
        return await BitcoinWallet.fromMnemonic(
          walletKeys.mnemonic,
          accountsService.activeAccount.index,
          provider as BitcoinProviderAbstract
        );
      } else if (walletKeys.xpub) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        // Use BIP44 derivation paths for extended public key of m/44'/60'/0'
        const addressPublicKey = getAddressPublicKeyFromXPub(
          walletKeys.xpub,
          accountsService.activeAccount.index
        );

        return new BitcoinLedgerWallet(
          addressPublicKey,
          getAddressDerivationPath(
            accountsService.activeAccount.index,
            DerivationPath.BIP44
          ),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport
        );
      } else if (walletKeys.pubKeys?.length) {
        // Use LedgerLive derivation paths for address public keys (m/44'/60'/n'/0/0) in storage
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const addressPublicKey =
          walletKeys.pubKeys[accountsService.activeAccount.index];

        if (!addressPublicKey) {
          throw new Error('Account public key not available');
        }

        return new BitcoinLedgerWallet(
          Buffer.from(addressPublicKey.evm, 'hex'),
          getAddressDerivationPath(
            accountsService.activeAccount.index,
            DerivationPath.LedgerLive
          ),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport
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

  async sign(tx: SignTransactionRequest, network?: Network): Promise<string> {
    const wallet = await this.getWallet(network);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // handle BTC signing
    if ('inputs' in tx) {
      if (
        !(wallet instanceof BitcoinWallet) &&
        !(wallet instanceof BitcoinLedgerWallet)
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

    if (!(wallet instanceof Wallet) && !(wallet instanceof LedgerSigner)) {
      throw new Error('Signing error, wrong network');
    }

    return await wallet.signTransaction(tx);
  }

  async signMessage(messageType: MessageType, data: any) {
    const wallet = await this.getWallet();

    if (!wallet || !(wallet instanceof Wallet)) {
      throw new Error(
        wallet
          ? `this function not supported on your wallet`
          : 'wallet undefined in sign tx'
      );
    }

    const privateKey = wallet.privateKey.toLowerCase().startsWith('0x')
      ? wallet.privateKey.slice(2)
      : wallet.privateKey;

    const key = Buffer.from(privateKey, 'hex');

    let result;

    if (data) {
      switch (messageType) {
        case MessageType.ETH_SIGN:
        case MessageType.PERSONAL_SIGN:
          result = await personalSign({ privateKey: key, data });
          break;
        case MessageType.SIGN_TYPED_DATA:
        case MessageType.SIGN_TYPED_DATA_V1:
          result = await signTypedData({
            privateKey: key,
            data,
            version: SignTypedDataVersion.V1,
          });
          break;
        case MessageType.SIGN_TYPED_DATA_V3:
          result = await signTypedData({
            privateKey: key,
            data,
            version: SignTypedDataVersion.V3,
          });
          break;
        case MessageType.SIGN_TYPED_DATA_V4:
          result = await signTypedData({
            privateKey: key,
            data,
            version: SignTypedDataVersion.V4,
          });
          break;
        default:
          key.fill(0);
          throw new Error('unknown method');
      }
      key.fill(0);
      return result;
    } else {
      throw new Error('no message to sign');
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

      const addressPublicKey = await getPubKeyFromTransport(
        this.ledgerService.recentTransport,
        index,
        DerivationPath.LedgerLive
      );

      if (!addressPublicKey || !addressPublicKey.byteLength) {
        throw new Error('Failed to get public key from device.');
      }

      const pubKeys = [...(secrets?.pubKeys || [])];
      pubKeys[index] = { evm: addressPublicKey.toString('hex') };

      await this.storageService.save<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        {
          ...secrets,
          pubKeys: pubKeys,
        }
      );
    }

    return this.getAddress(index);
  }

  async getAddress(index: number): Promise<Record<NetworkVMType, string>> {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );
    const isMainnet = await this.networkService.isMainnet();

    if (secrets?.xpub) {
      return {
        [NetworkVMType.EVM]: getAddressFromXPub(secrets.xpub, index),
        [NetworkVMType.BITCOIN]: getBech32AddressFromXPub(
          secrets.xpub,
          index,
          isMainnet ? networks.bitcoin : networks.testnet
        ),
      };
    } else if (secrets?.pubKeys) {
      // pubkeys are used for LedgerLive derivation paths m/44'/60'/n'/0/0
      const addressPublicKey = secrets.pubKeys[index];

      if (!addressPublicKey?.evm) {
        throw new Error('Account not added');
      }

      const pubKeyBuffer = Buffer.from(addressPublicKey.evm, 'hex');

      return {
        [NetworkVMType.EVM]: getEvmAddressFromPubKey(pubKeyBuffer),
        [NetworkVMType.BITCOIN]: getBtcAddressFromPubKey(
          pubKeyBuffer,
          isMainnet ? networks.bitcoin : networks.testnet
        ),
      };
    }

    throw new Error('No public key available');
  }
}
