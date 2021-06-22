import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';

const testnet = NetworkConstants.TestnetConfig;
const mainnet = NetworkConstants.MainnetConfig;

type Network = string;

class NetworkStore {
  network: Network = 'testnet';

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['network'], 'NetworkStore');
  }

  changeNetwork(network) {
    const net = network === 'testnet' ? testnet : mainnet;
    Network.setNetwork(net);
  }
}

export default NetworkStore;
