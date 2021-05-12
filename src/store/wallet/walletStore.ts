import { makeAutoObservable, autorun, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { MnemonicWallet, BN, Utils, ERC20 } from 'avalanche-wallet-sdk';

configure({
  enforceActions: 'never',
});
type Network = string;

class WalletStore {
  wallet: any = '';
  addrX: string = '';
  addrP: string = '';
  addrC: string = '';
  addrInternalX: string = '';
  hdIndexExternal: number = 0;
  hdIndexInternal: number = 0;
  balanceCRaw: any = '';
  balanceC: any = '';
  balanceP: any = '';
  balanceERC20: any = '';
  stakeAmt: any = '';
  mnemonic: string =
    'surge dance motion borrow similar kangaroo reform swear exercise chief suffer dash rabbit piano chapter viable normal barrel age mask arch ozone cherry leader';

  constructor() {
    makeAutoObservable(this);
    persistStore(
      this,
      [
        'wallet',
        'addrX',
        'addrP',
        'addrC',
        'addrInternalX',
        'hdIndexExternal',
        'hdIndexInternal',
        'balanceC',
        'balanceP',
        'balanceERC20',
        'stakeAmt',
        'mnemonic',
      ],
      'WalletStore'
    );
  }

  importHD(mnemonic): void {
    this.mnemonic = mnemonic;
    this.updateWallet();
  }

  refreshHD(): void {
    const wallet = this.MnemonicWallet();

    wallet.resetHdIndices();
  }

  createMnemonic(): void {
    MnemonicWallet.create();
    this.mnemonic = MnemonicWallet.generateMnemonicPhrase();
  }

  async getUtxos(): Promise<void> {
    const wallet = this.MnemonicWallet();

    await wallet.getUtxosX();
    await wallet.getUtxosP();
  }

  async getPrice(): Promise<number> {
    return await Utils.getAvaxPrice();
  }

  updateWallet(): void {
    const wallet = this.MnemonicWallet();

    this.addrX = wallet.getAddressX();
    this.addrP = wallet.getAddressP();
    this.addrC = wallet.getAddressC();

    this.addrInternalX = wallet.getChangeAddressX();
    this.hdIndexExternal = wallet.getExternalIndex();
    this.hdIndexInternal = wallet.getInternalIndex();
  }

  async updateBalance(): Promise<void> {
    const wallet = this.MnemonicWallet();

    await this.getUtxos();

    this.balanceCRaw = await wallet.updateAvaxBalanceC();
    this.balanceC = await Utils.bnToAvaxC(this.balanceCRaw);
    this.balanceP = await wallet.getAvaxBalanceP();
    this.balanceERC20 = await wallet.updateBalanceERC20();

    this.stakeAmt = await wallet.getStake();
  }

  MnemonicWallet() {
    return MnemonicWallet.fromMnemonic(this.mnemonic);
  }

  balCClean() {
    if (!this.balanceC) {
      console.log('missing C balance');
      return;
    }
    return Utils.bnToAvaxC(this.balanceC);
  }

  stakeAmountClean() {
    return Utils.bnToAvaxX(this.stakeAmt);
  }

  async addERC20Contract(address: string) {
    await ERC20.addErc20Token(address);
  }
}

export default WalletStore;
