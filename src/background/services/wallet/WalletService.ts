import {
  clearWallet,
  initWalletLedger,
  initWalletMnemonic,
  wallet$,
  WalletState,
  walletState$,
} from '@avalabs/wallet-react-components';
import BN from 'bn.js';
import { EventEmitter } from 'events';
import { firstValueFrom, Subscription } from 'rxjs';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  isMnemonicWallet,
  WalletEvents,
  WalletSecretInStorage,
  WALLET_STORAGE_KEY,
} from './models';
import * as bitcoin from 'bitcoinjs-lib';
import { signPsbt } from '@avalabs/bridge-sdk';
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx';
import { MessageType } from '../messages/models';

@singleton()
export class WalletService {
  private eventEmitter = new EventEmitter();
  private _walletState: WalletState | undefined;
  private walletStateSubscription?: Subscription;
  constructor(private storageService: StorageService) {}

  public get walletState(): WalletState | undefined {
    return this._walletState;
  }

  async activate(password: string) {
    const walletKeys = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY,
      password
    );

    if (!walletKeys) {
      // wallet is not initialized
      return;
    }

    if (walletKeys.mnemonic) {
      await initWalletMnemonic(walletKeys.mnemonic);
    } else if (walletKeys.publicKey) {
      await initWalletLedger(walletKeys.publicKey);
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
  async init({
    password,
    mnemonic,
    publicKey,
  }: {
    password: string;
    mnemonic?: string;
    publicKey?: string;
  }) {
    if (!mnemonic && !publicKey) {
      throw new Error('Mnemonic or publicKey is required');
    }

    await this.storageService.save<WalletSecretInStorage>(
      WALLET_STORAGE_KEY,
      { mnemonic, publicKey },
      password
    );

    await this.activate(password);
  }

  lock() {
    clearWallet();
    this.walletStateSubscription?.unsubscribe();
    this._walletState = undefined;
    this.eventEmitter.emit(WalletEvents.WALLET_STATE_UPDATE, { locked: true });
  }

  async getMnemonic(password: string) {
    const secrets = await this.storageService.load<WalletSecretInStorage>(
      WALLET_STORAGE_KEY,
      password
    );
    if (!secrets?.mnemonic) {
      throw new Error('Not a MnemonicWallet');
    }

    return secrets.mnemonic;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const secrets = await this.storageService.load<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        oldPassword
      );

      if (!secrets) {
        throw new Error('wallet not initialized');
      }

      this.storageService.save<WalletSecretInStorage>(
        WALLET_STORAGE_KEY,
        secrets,
        newPassword
      );
    } catch (err) {
      console.error(err);
      return Promise.reject(new Error('password incorrect'));
    }
  }

  async sendCustomTx(
    gasPrice: BN,
    gasLimit: number,
    data?: string | undefined,
    to?: string | undefined,
    value?: string | undefined,
    nonce?: number | undefined
  ) {
    const wallet = await firstValueFrom(wallet$);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return wallet?.sendCustomEvmTx(gasPrice, gasLimit, data, to, value, nonce);
  }

  async signBtc(unsignedTxHex: string): Promise<bitcoin.Transaction> {
    const wallet = await firstValueFrom(wallet$);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    if (!isMnemonicWallet(wallet)) {
      throw new Error('Only MnemonicWallet supported');
    }

    const psbt = bitcoin.Psbt.fromHex(unsignedTxHex);
    return signPsbt(
      wallet.evmWallet.getPrivateKeyHex(),
      psbt
    ).extractTransaction();
  }

  async signEvm(
    tx: Transaction
  ): Promise<Transaction | FeeMarketEIP1559Transaction> {
    const wallet = await firstValueFrom(wallet$);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return await wallet.signEvm(tx);
  }

  async signMessage(messageType: MessageType, data: any) {
    const wallet = await firstValueFrom(wallet$);
    if (!wallet || wallet.type === 'ledger') {
      throw new Error(
        wallet
          ? `this function not supported on ${wallet.type} wallet`
          : 'wallet undefined in sign tx'
      );
    }
    if (data) {
      switch (messageType) {
        case MessageType.ETH_SIGN:
        case MessageType.PERSONAL_SIGN:
          return await wallet.personalSign(data);
        case MessageType.SIGN_TYPED_DATA:
        case MessageType.SIGN_TYPED_DATA_V1:
          return await wallet.signTypedData_V1(data);
        case MessageType.SIGN_TYPED_DATA_V3:
          return await wallet.signTypedData_V3(data);
        case MessageType.SIGN_TYPED_DATA_V4:
          return await wallet.signTypedData_V4(data);
      }
      throw new Error('unknown method');
    } else {
      throw new Error('no message to sign');
    }
  }

  addListener(event: WalletEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
