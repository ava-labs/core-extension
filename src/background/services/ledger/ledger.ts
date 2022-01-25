import {
  ledgerTransport$,
  ledgerPubKey$,
  initWalletLedger,
} from '@avalabs/wallet-react-components';
import {
  combineLatest,
  delay,
  filter,
  from,
  map,
  mapTo,
  merge,
  mergeMap,
  retryWhen,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { initAccounts } from '../accounts/accounts';
import {
  getPublicKeyFromStorage,
  savePhraseOrKeyToStorage,
} from '../wallet/storage';
import { restartWalletLock$ } from '../wallet/walletLocked';
import { walletUnlock$ } from '../wallet/walletUnlock';
import { initLedgerTransport } from './handlers/initLedgerTransport';

const _pubKey = new Subject<{ pubKey: string; password: string }>();

/**
 * Aggregating the ledger state so that it shows in app state
 */
export const ledgerState$ = combineLatest([
  ledgerTransport$,
  ledgerPubKey$,
]).pipe(map(([transport, pubKey]) => ({ transport, pubKey })));

export const freshPubKey = _pubKey.pipe(
  switchMap(({ pubKey, password }) => {
    return from(savePhraseOrKeyToStorage(password, undefined, pubKey)).pipe(
      mapTo(pubKey)
    );
  })
);

/**
 * Listen for public key from storage, if this is truthy then we need to wait for the unlock,
 * otherwise we drop the waiting and move along
 */
const pubKeyFromStorage = from(getPublicKeyFromStorage()).pipe(
  // only listen to unlock events if we have a public key stored
  filter((res) => !!res),
  switchMap(() => walletUnlock$),
  map((state) => state.value)
);

merge(pubKeyFromStorage, freshPubKey)
  .pipe(
    tap((pubKey: string) => {
      initWalletLedger(pubKey);
      restartWalletLock$.next(true);
      initAccounts();
    }),
    // after unlock make sure we always have a ledger transport
    switchMap(() =>
      ledgerTransport$.pipe(
        filter((transport) => !transport),
        mergeMap(() => initLedgerTransport()),
        retryWhen((errors) => errors.pipe(delay(2000)))
      )
    )
  )
  .subscribe();

export function setPublicKeyAndCreateWallet(pubKey: string, password: string) {
  _pubKey.next({ pubKey, password });
}
