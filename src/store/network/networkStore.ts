import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';

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
  network = SELECTEDNETWORK.FUJI;

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['network'], 'NetworkStore');
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
