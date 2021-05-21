import { makeAutoObservable, autorun, observable, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { MnemonicWallet, ERC20, Utils } from 'avalanche-wallet-sdk';
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
  balanceX: any = '';
  balanceERC20: any = '';
  stakeAmt: any = '';
  customERC20Contracts: string[] = [];
  mnemonic: string =
    'surge dance motion borrow similar kangaroo reform swear exercise chief suffer dash rabbit piano chapter viable normal barrel age mask arch ozone cherry leader';
  lastTransactionSent: string = '';

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
        'balanceX',
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
    this.updateBalance();
  }

  refreshHD(): void {
    this.wallet.resetHdIndices();
  }

  createMnemonic(): void {
    MnemonicWallet.create();
    this.mnemonic = MnemonicWallet.generateMnemonicPhrase();
  }

  async getUtxos(): Promise<void> {
    await this.wallet.getUtxosX();
    await this.wallet.getUtxosP();
  }

  async getPrice(): Promise<number> {
    return await Utils.getAvaxPrice();
  }

  updateWallet(): void {
    this.addrX = this.wallet.getAddressX();
    this.addrP = this.wallet.getAddressP();
    this.addrC = this.wallet.getAddressC();

    this.addrInternalX = this.wallet.getChangeAddressX();
    this.hdIndexExternal = this.wallet.getExternalIndex();
    this.hdIndexInternal = this.wallet.getInternalIndex();
  }

  async updateBalance(): Promise<void> {
    await this.getUtxos();
    await this.updateCustomERC20s();

    this.balanceCRaw = await this.wallet.updateAvaxBalanceC();
    this.balanceC = await Utils.bnToAvaxC(this.balanceCRaw);
    this.balanceP = await this.wallet.getAvaxBalanceP();
    this.balanceX = await this.wallet.getAvaxBalanceX();
    this.balanceERC20 = await this.wallet.updateBalanceERC20();
    this.stakeAmt = await this.wallet.getStake();
  }

  async sendTransaction(data: any): Promise<string> {
    const { to, amount, tokenContract } = data;

    // let to = '0x254df0daf08669c61d5886bd81c4a7fa59ff7c7e';
    // let amount = Utils.numberToBN('0.000001', 18);
    // let tokenContract = '0xEa81F6972aDf76765Fd1435E119Acc0Aafc80BeA';

    const gasPrice = Utils.numberToBN(225, 9);
    const gasLimit = 221000;

    try {
      const txID = await this.wallet.sendErc20(
        to,
        amount,
        gasPrice,
        gasLimit,
        tokenContract
      );
      this.lastTransactionSent = txID;
      return txID;
    } catch (error) {
      return error.message;
    }
  }

  MnemonicWallet() {
    // return MnemonicWallet.fromMnemonic(this.mnemonic);
    this.wallet = MnemonicWallet.fromMnemonic(this.mnemonic);
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
    for (const each of this.customERC20Contracts) {
      await this.wallet.getBalanceERC20(each);
    }
  }

  async addERC20Contract(address: string) {
    try {
      await this.wallet.getBalanceERC20(address);
      if (!isInArray(address, this.customERC20Contracts)) {
        this.customERC20Contracts.push(address);
      }
    } catch (error) {
      console.log('incorrect ERC20 address', error);
    }
  }

  async getERC20ContractData(address: string) {
    let test = await ERC20.getContractData(address);
    return test;
  }

  get ERC20Tokens() {
    return this.balanceERC20;
  }
}

export default WalletStore;
