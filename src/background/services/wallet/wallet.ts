import { Signal, ValueCache } from 'micro-signals';
import {
  LedgerWallet,
  MnemonicWallet,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk';
import { saveToStorage, getFromStorage } from '@src/utils/storage';

export function isMnemonicWallet(wallet: WalletType): wallet is MnemonicWallet {
  return wallet.type === 'mnemonic';
}

export function isLedgerWallet(wallet: WalletType): wallet is LedgerWallet {
  return wallet.type === 'ledger';
}

export function getAccountsFromWallet(wallet: WalletType) {
  return [wallet.getAddressC()];
}

const _wallet = new Signal<WalletType>();

_wallet.peek(async (wallet) => {
  isMnemonicWallet(wallet)
    ? await wallet.resetHdIndices(
        wallet.getExternalIndex(),
        wallet.getInternalIndex()
      )
    : Promise.reject('cant resetHdIndices on this type of wallet');

  await wallet.updateUtxosX();
  await wallet.updateUtxosP();
});

class WalletService {
  wallet = _wallet.cache(new ValueCache()).readOnly();

  constructor() {
    this.mnemonic.then(
      (store) =>
        store && store['mnemonic'] && this.createFromMnemonic(store['mnemonic'])
    );
  }

  async createFromMnemonic(mnemonic: string) {
    await saveToStorage({ mnemonic });
    const wallet = MnemonicWallet.fromMnemonic(mnemonic);
    _wallet.dispatch(wallet);
    return wallet;
  }

  async createWithNewMnemonic() {
    MnemonicWallet.create();
    const mnemonic = MnemonicWallet.generateMnemonicPhrase();
    return this.createFromMnemonic(mnemonic);
  }

  get mnemonic() {
    return getFromStorage('mnemonic');
  }
}

export const walletService = new WalletService();
