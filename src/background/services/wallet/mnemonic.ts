import { Subject, from, merge, filter } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { getMnemonicFromStorage, savePhraseOrKeyToStorage } from './storage';
import { walletUnlock$ } from './walletUnlock';
import { initWalletMnemonic } from '@avalabs/wallet-react-components';
import { initAccounts } from '../accounts/accounts';
import { restartWalletLock$ } from './walletLocked';

const _mnemonic = new Subject<{ mnemonic: string; password: string }>();

export const freshMnemonic = _mnemonic.pipe(
  switchMap(({ mnemonic, password }) => {
    return from(savePhraseOrKeyToStorage({ password, mnemonic })).pipe(
      mapTo(mnemonic)
    );
  })
);

/**
 * If we are reading from storage then the extension has been restarted and
 * we know the mnemonic has to be unencrypted so we have to lock the wallet until
 * this is done
 */
const mnemonicFromStorage = from(getMnemonicFromStorage()).pipe(
  // only listen to unlock events if we have a mnemonic stored
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
  initAccounts();
});

export function setMnemonicAndCreateWallet(mnem: string, password: string) {
  _mnemonic.next({ mnemonic: mnem, password });
}
