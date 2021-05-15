import { makeAutoObservable, autorun, observable, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { MnemonicWallet, BN, Utils } from 'avalanche-wallet-sdk';
import { isInArray } from '@src/utils/common';

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
  customERC20Contracts: string[] = [];
  mnemonic: string =
    'surge dance motion borrow similar kangaroo reform swear exercise chief suffer dash rabbit piano chapter viable normal barrel age mask arch ozone cherry leader';

  constructor() {
    makeAutoObservable(this, {
      balanceERC20: observable,
    });
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
        'customERC20Contracts',
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
    await this.updateCustomERC20s();

    this.balanceCRaw = await wallet.updateAvaxBalanceC();
    this.balanceC = await Utils.bnToAvaxC(this.balanceCRaw);
    this.balanceP = await wallet.getAvaxBalanceP();
    this.balanceERC20 = await wallet.updateBalanceERC20();
    this.stakeAmt = await wallet.getStake();
  }

  async sendTransaction(): Promise<string> {
    const wallet = this.MnemonicWallet();

    let to = '0x254df0daf08669c61d5886bd81c4a7fa59ff7c7e';
    let amt = Utils.numberToBN('0.000001', 18);
    let tokenContract = '0xEa81F6972aDf76765Fd1435E119Acc0Aafc80BeA';
    const gasPrice = Utils.numberToBN(225, 9);
    const gasLimit = 221000;

    try {
      const txID = await wallet.sendErc20(
        to,
        amt,
        gasPrice,
        gasLimit,
        tokenContract
      );
      console.log('tx passordet', txID);

      return txID;
    } catch (error) {
      console.log('err', error);
      return error;
    }
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

  async updateCustomERC20s() {
    const wallet = this.MnemonicWallet();
    for (const each of this.customERC20Contracts) {
      await wallet.getBalanceERC20(each);
    }
  }

  async addERC20Contract(address: string) {
    const wallet = this.MnemonicWallet();

    try {
      await wallet.getBalanceERC20(address);
      if (!isInArray(address, this.customERC20Contracts)) {
        this.customERC20Contracts.push(address);
      }
    } catch (error) {
      console.log('incorrect ERC20 address', error);
    }

    //    await ERC20.addErc20Token(address);
  }

  get ERC20Tokens() {
    return this.balanceERC20;
  }
}

export default WalletStore;
