import { ActiveNetwork, MAINNET_NETWORK, supportedNetworks } from './models';
import { getNetworkFromStorage } from './storage';
import { Network } from '@avalabs/avalanche-wallet-sdk';
import { BehaviorSubject } from 'rxjs';

export const network$ = new BehaviorSubject<ActiveNetwork>(MAINNET_NETWORK);

getNetworkFromStorage().then(
  (activeNetwork) => activeNetwork && network$.next(activeNetwork)
);

network$.subscribe((selectedNetwork) => {
  Network.setNetwork(selectedNetwork.config);
});
