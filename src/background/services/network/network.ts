import { getNetworkFromStorage, saveNetworkToStorage } from './storage';
import { network$ } from '@avalabs/wallet-react-components';
import { tap } from 'rxjs';

getNetworkFromStorage().then((activeNetwork) => {
  activeNetwork && network$.next(activeNetwork);
});

network$
  .pipe(
    tap((selectedNetwork) => {
      selectedNetwork && saveNetworkToStorage(selectedNetwork);
    })
  )
  .subscribe();
