import { getNetworkFromStorage } from './storage';
import { Network } from '@avalabs/avalanche-wallet-sdk';
import { network$ } from '@avalabs/wallet-react-components';

getNetworkFromStorage().then(
  (activeNetwork) => activeNetwork && network$.next(activeNetwork)
);

network$.subscribe((selectedNetwork) => {
  Network.setNetwork(selectedNetwork.config);
});
