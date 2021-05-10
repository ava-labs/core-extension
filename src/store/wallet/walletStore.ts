import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { MnemonicWallet, BN, Utils } from 'avalanche-wallet-sdk';

type Network = string;

class WalletStore {
  wallet: any = '';

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['wallet'], 'WalletStore');
  }

  importHD(mnemonic) {
    this.wallet = MnemonicWallet.fromMnemonic(mnemonic);
  }

  refreshHD() {
    this.wallet.resetHdIndices();
  }

  async getPrice(): Promise<number> {
    return await Utils.getAvaxPrice();
  }

  createMnemonic() {
    this.wallet = MnemonicWallet.create();

    const Mnemonic = MnemonicWallet.generateMnemonicPhrase();

    return Mnemonic;
  }
}

export default WalletStore;
