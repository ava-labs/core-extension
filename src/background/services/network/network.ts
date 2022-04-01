import { getNetworkFromStorage, saveNetworkToStorage } from './storage';
import { network$ } from '@avalabs/wallet-react-components';
import { filter, switchMap, tap, withLatestFrom } from 'rxjs';
import { storageKey$ } from '../wallet/storageKey';

storageKey$
  .pipe(
    filter((ready) => !!ready),
    switchMap(() => getNetworkFromStorage())
  )
  .subscribe((activeNetwork) => {
    activeNetwork && network$.next(activeNetwork);
  });

network$
  .pipe(
    withLatestFrom(storageKey$),
    tap(([selectedNetwork, ready]) => {
      !!ready && selectedNetwork && saveNetworkToStorage(selectedNetwork);
    })
  )
  .subscribe();
