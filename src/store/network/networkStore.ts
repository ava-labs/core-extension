import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';

const testnet = NetworkConstants.TestnetConfig;
const mainnet = NetworkConstants.MainnetConfig;

export enum SELECTEDNETWORK {
  FUJI = 'testnet',
  MAINNET = 'mainnet',
}
class NetworkStore {
  network = SELECTEDNETWORK.FUJI;

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['network'], 'NetworkStore');
  }

  get isFujiNetwork() {
    return this.network === SELECTEDNETWORK.FUJI;
  }

  changeToFujiNetwork() {
    this.changeNetwork(SELECTEDNETWORK.FUJI);
  }
  changeToMainNetwork() {
    this.changeNetwork(SELECTEDNETWORK.MAINNET);
  }

  changeNetwork(network: SELECTEDNETWORK) {
    this.network = network;
    Network.setNetwork(this.isFujiNetwork ? testnet : mainnet);
  }
}

export default NetworkStore;
