import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import { setNetwork, NetworkConstants } from 'avalanche-wallet-sdk';

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
    setTimeout(function () {
      const net = network === 'testnet' ? testnet : mainnet;
      setNetwork(net);
    }, 1000);
  }
}

export default NetworkStore;
