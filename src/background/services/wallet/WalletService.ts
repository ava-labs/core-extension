import {
  clearWallet,
  initWalletLedger,
  initWalletMnemonic,
  WalletState,
  walletState$,
} from '@avalabs/wallet-react-components';
import { EventEmitter } from 'events';
import { Subscription } from 'rxjs';
import { container, singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  SignTransactionRequest,
  WalletEvents,
  WalletSecretInStorage,
  WALLET_STORAGE_KEY,
} from './models';
import { MessageType } from '../messages/models';
import {
  BitcoinLedgerWallet,
  BitcoinProviderAbstract,
  BitcoinWallet,
  getAddressFromXPub,
  getBech32AddressFromXPub,
  getWalletFromMnemonic,
  JsonRpcBatchInternal,
  LedgerSigner,
} from '@avalabs/wallets-sdk';
import { NetworkService } from '../network/NetworkService';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { LockService } from '../lock/LockService';
import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
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
export class WalletService implements OnLock {
  private eventEmitter = new EventEmitter();
  private _walletState: WalletState | undefined;
  private walletStateSubscription?: Subscription;
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private ledgerService: LedgerService
  ) {}

  public get walletState(): WalletState | undefined {
    return this._walletState;
  }

  async activate() {
    const walletKeys = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );

    if (!walletKeys) {
      // wallet is not initialized
      return;
    }

    if (walletKeys.mnemonic) {
      await initWalletMnemonic(walletKeys.mnemonic);
    } else if (walletKeys.xpub) {
      await initWalletLedger(walletKeys.xpub);
    } else {
      throw new Error('Wallet initialization failed, no key found');
    }

    this.walletStateSubscription = walletState$.subscribe((state) => {
      this._walletState = state;
      this.eventEmitter.emit(
        WalletEvents.WALLET_STATE_UPDATE,
        this._walletState
      );
    });
  }

  /**
   * Called during the onboarding flow.
   * Responsible for saving the mnemonic/pubkey and activating the wallet.
   */
  async init({ mnemonic, xpub }: { xpub: string; mnemonic?: string }) {
    if (!mnemonic && !xpub) {
      throw new Error('Mnemonic or xpub is required');
    }

    await this.storageService.save<WalletSecretInStorage>(WALLET_STORAGE_KEY, {
      mnemonic,
      xpub,
    });
    await this.activate();
  }

  onLock() {
    clearWallet();
    this.walletStateSubscription?.unsubscribe();
    this._walletState = undefined;
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
      !walletKeys.xpub ||
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
          accountsService.activeAccount.index
        );
        return wallet.connect(provider as JsonRpcBatchInternal);
      } else if (walletKeys.xpub) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new LedgerSigner(
          accountsService.activeAccount.index,
          this.ledgerService.recentTransport,
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

        return new BitcoinLedgerWallet(
          walletKeys.xpub,
          accountsService.activeAccount.index,
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

    // TODO Remove as soon as react-wallet-components is removed and circular dependency is fixed
    const lockService = container.resolve(LockService);
    if (!lockService.verifyPassword(password)) {
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

    if (data) {
      switch (messageType) {
        case MessageType.ETH_SIGN:
        case MessageType.PERSONAL_SIGN:
          return await personalSign({ privateKey: key, data });
        case MessageType.SIGN_TYPED_DATA:
        case MessageType.SIGN_TYPED_DATA_V1:
          return await signTypedData({
            privateKey: key,
            data,
            version: SignTypedDataVersion.V1,
          });
        case MessageType.SIGN_TYPED_DATA_V3:
          return await signTypedData({
            privateKey: key,
            data,
            version: SignTypedDataVersion.V3,
          });
        case MessageType.SIGN_TYPED_DATA_V4:
          return await signTypedData({
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
  }

  addListener(event: WalletEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }

  async getAddress(index: number): Promise<Record<NetworkVMType, string>> {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY
    );
    const isMainnet = await this.networkService.isMainnet();

    if (!secrets?.xpub) {
      throw new Error('No xpub found');
    }

    return {
      [NetworkVMType.EVM]: getAddressFromXPub(secrets.xpub, index),
      [NetworkVMType.BITCOIN]: getBech32AddressFromXPub(
        secrets.xpub,
        index,
        isMainnet ? networks.bitcoin : networks.testnet
      ),
    };
  }
}
