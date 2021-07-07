import { makeAutoObservable, observable, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import {
  MnemonicWallet,
  Utils,
  BN,
  Assets,
} from '@avalabs/avalanche-wallet-sdk';
import { isInArray } from '@src/utils/common';
import { WalletType } from '@avalabs/avalanche-wallet-sdk/dist/Wallet/types';
import { store } from '@src/store/store';
import { normalize } from 'eth-sig-util';

import {
  AssetBalanceP,
  AssetBalanceRawX,
} from '@avalabs/avalanche-wallet-sdk/dist/Wallet/types';
import { Signal } from 'micro-signals';

configure({
  enforceActions: 'never',
});

class WalletStore {
  wallet: WalletType | undefined = undefined;
  addrX: string = '';
  addrP: string = '';
  addrC: string = '';
  addrInternalX: string = '';
  hdIndexExternal: number = 0;
  hdIndexInternal: number = 0;
  balanceCRaw: BN = new BN(0);
  balanceC: string = '';
  balanceP: AssetBalanceP = {
    unlocked: new BN(0),
    locked: new BN(0),
    lockedStakeable: new BN(0),
  };
  balanceX: AssetBalanceRawX = {
    unlocked: new BN(0),
    locked: new BN(0),
  };
  balanceERC20: any = '';
  stakeAmt: any = '';
  customERC20Contracts: string[] = [];
  mnemonic: string = '';
  lastTransactionSent: string = '';
  /**
   * This will be c chain addresses
   */
  get accounts() {
    return (store.extensionStore.isUnlocked ? [this.addrC] : []).map(normalize);
  }

  /**
   * This is fired when mnemonic is set from anywhere so that we can create a wallet only if mnemonic exists or
   * when it is set
   */
  mnemonicSetSignal = new Signal<string>();

  constructor() {
    makeAutoObservable(this, {
      balanceERC20: observable,
    });
    persistStore(
      this,
      [
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

  async refreshHD() {
    let wallet = this.wallet as MnemonicWallet;

    await wallet.resetHdIndices(this.hdIndexExternal, this.hdIndexInternal);
  }

  createMnemonic(): void {
    MnemonicWallet.create();
    this.mnemonic = MnemonicWallet.generateMnemonicPhrase();
    this.mnemonicSetSignal.dispatch(this.mnemonic);
  }

  async getEthPrivateKey() {
    if (this.wallet!.type !== 'ledger') {
      let wallet = this.wallet as MnemonicWallet;
      return await wallet.getEvmPrivateKeyHex();
    }
  }

  async updateUtxos(): Promise<void> {
    await this.wallet!.updateUtxosX();
    await this.wallet!.updateUtxosP();
  }

  async getPrice(): Promise<number> {
    return await Utils.getAvaxPrice();
  }

  updateWallet(): void {
    if (typeof this.wallet === undefined) {
      return;
    }

    this.addrX = this.wallet!.getAddressX();
    this.addrP = this.wallet!.getAddressP();
    this.addrC = this.wallet!.getAddressC();

    this.addrInternalX = this.wallet!.getChangeAddressX();

    if (this.wallet!.type === 'mnemonic') {
      let wallet = this.wallet as MnemonicWallet;

      this.hdIndexExternal = wallet.getExternalIndex();
      this.hdIndexInternal = wallet.getInternalIndex();
    }
  }

  async updateBalance(): Promise<void> {
    await this.updateUtxos();
    await this.updateCustomERC20s();

    //  const { C, P, X } = await this.wallet!.getAvaxBalance();

    this.balanceCRaw = await this.wallet!.updateAvaxBalanceC();
    this.balanceC = await Utils.bnToAvaxC(this.balanceCRaw);
    this.balanceP = await this.wallet!.getAvaxBalanceP();
    // this.balanceX = await this.wallet!.getAvaxBalanceX();
    this.balanceERC20 = await this.wallet!.updateBalanceERC20();
    this.stakeAmt = await this.wallet!.getStake();
  }

  async sendTransaction(data: any): Promise<string> {
    const { to, amount, tokenContract } = data;

    const gasPrice = Utils.numberToBN(225, 9);
    const gasLimit = 221000;

    try {
      const txID = await this.wallet!.sendErc20(
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

  //
  // async sendXtransaction() {
  //   // x chain
  //   let amount = Utils.numberToBN('0.000001', 9);

  //   try {
  //     const tx = await this.wallet!.sendAvaxX(
  //       'X-fuji1dtz57htfgfsc8r8wwhrymf54nz2c0qmu3dmm4v',
  //       amount
  //     );
  //     console.log('tx', tx);

  //     let history = await this.wallet?.getHistory(5);
  //     console.log('history', history);
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // }

  async MnemonicWallet() {
    // check for wallet type, singleton vs mnemonic
    const mnemonic = await (this.mnemonic
      ? Promise.resolve(this.mnemonic)
      : this.mnemonicSetSignal.promisify());
    this.wallet = MnemonicWallet.fromMnemonic(mnemonic);
    await this.refreshHD();
  }

  stakeAmountClean() {
    return Utils.bnToAvaxX(this.stakeAmt);
  }

  async updateCustomERC20s() {
    for (const each of this.customERC20Contracts) {
      await this.wallet!.getBalanceERC20(each);
    }
  }

  async addERC20Contract(address: string) {
    try {
      await this.wallet!.getBalanceERC20(address);
      if (!isInArray(address, this.customERC20Contracts)) {
        this.customERC20Contracts.push(address);
      }
    } catch (error) {
      console.log('incorrect ERC20 address', error);
    }
  }

  async getERC20ContractData(address: string) {
    let data = await Assets.getContractData(address);
    return data;
  }

  get ERC20Tokens() {
    return this.balanceERC20;
  }

  getGrandTotal(precision?: number): string {
    const p = Utils.bnToBig(this.balanceP.unlocked, 9);
    //  const x = Utils.bnToBig(this.balanceX.unlocked, 9);
    const c = Utils.bnToBig(this.balanceCRaw, 18);

    //  const xu = Utils.bnToBig(this.balanceX.unlocked, 9);
    const pl = Utils.bnToBig(this.balanceP.locked, 9);
    const ps = Utils.bnToBig(this.balanceP.lockedStakeable, 9);

    //    let total = p.add(x).add(c).add(xu).add(pl).add(ps);
    let total = p.add(c).add(pl).add(ps);

    if (precision) {
      return total.toFixed(precision).toLocaleString();
    }

    return total.toLocaleString();
  }

  getCleanTotalBalance(precision?: number): string {
    const p = Utils.bnToBig(this.balanceP.unlocked, 9);
    //const x = Utils.bnToBig(this.balanceX.unlocked, 9);
    const c = Utils.bnToBig(this.balanceCRaw, 18);

    let sum = p.add(c);
    //  let sum = p.add(x);
    //   sum = sum.add(c);
    if (precision) {
      return sum.toFixed(precision).toLocaleString();
    }

    return sum.toLocaleString();
  }
}

export default WalletStore;
