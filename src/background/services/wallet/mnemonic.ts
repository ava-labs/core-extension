import { Subject, from, merge, filter } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { getMnemonicFromStorage, savePhraseOrKeyToStorage } from './storage';
import { walletUnlock$ } from './walletUnlock';
import { initWalletMnemonic } from '@avalabs/wallet-react-components';
import { restartWalletLock$ } from './walletLocked';

const _mnemonic = new Subject<{
  mnemonic: string;
  password: string;
  storageKey: string;
}>();

export const freshMnemonic = _mnemonic.pipe(
  switchMap(({ mnemonic, password, storageKey }) => {
    return from(
      savePhraseOrKeyToStorage({ password, mnemonic, storageKey })
    ).pipe(mapTo(mnemonic));
  })
);

/**
 * If we are reading from storage then the extension has been restarted and
 * we know the mnemonic has to be unencrypted so we have to lock the wallet until
 * this is done
 */
const mnemonicFromStorage = merge(
  from(getMnemonicFromStorage()),
  freshMnemonic
).pipe(
  // only listen to unlock events if we have a mnemonic stored or a new mnemonic wallet is created with
  filter((res) => !!res),
  switchMap(() => walletUnlock$),
  map((state) => state.value)
);

/**
 * When a value emits, push it to the mnemonic subject in the SDK and that will kick off the wallet
 */
merge(mnemonicFromStorage, freshMnemonic).subscribe((mnemonic) => {
  initWalletMnemonic(mnemonic);
  restartWalletLock$.next(true);
});

export function setMnemonicAndCreateWallet(
  mnem: string,
  password: string,
  storageKey: string
) {
  _mnemonic.next({ mnemonic: mnem, password, storageKey });
}
