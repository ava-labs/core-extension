import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';
import { getStoreFromStorage } from '@src/background/utils/storage';

const testnet = NetworkConstants.TestnetConfig;
const mainnet = NetworkConstants.MainnetConfig;

export enum SELECTEDNETWORK {
  FUJI = 'testnet',
  MAINNET = 'mainnet',
}

export function isFujiNetwork(network: SELECTEDNETWORK) {
  return network === SELECTEDNETWORK.FUJI;
}
class NetworkStore {
  _network = SELECTEDNETWORK.FUJI;
  get network() {
    const transactionStore = getStoreFromStorage('NetworkStore');
    const network = transactionStore._network;
    return network || SELECTEDNETWORK.FUJI;
  }
  set network(network: SELECTEDNETWORK) {
    this._network = network;
  }

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['_network'], 'NetworkStore');
  }

  changeToFujiNetwork() {
    this.changeNetwork(SELECTEDNETWORK.FUJI);
  }
  changeToMainNetwork() {
    this.changeNetwork(SELECTEDNETWORK.MAINNET);
  }

  changeNetwork(network: SELECTEDNETWORK) {
    this.network = network;
    Network.setNetwork(isFujiNetwork(network) ? testnet : mainnet);
  }
}

export default NetworkStore;
