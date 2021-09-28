import { getNetworkFromStorage, saveNetworkToStorage } from './storage';
import { Network } from '@avalabs/avalanche-wallet-sdk';
import { network$ } from '@avalabs/wallet-react-components';
import { tap } from 'rxjs';

getNetworkFromStorage().then((activeNetwork) => {
  activeNetwork && network$.next(activeNetwork);
});

export const currentNetwork$ = network$.pipe(
  tap((selectedNetwork) => {
    Network.setNetwork(selectedNetwork.config);
    saveNetworkToStorage(selectedNetwork);
  })
);
