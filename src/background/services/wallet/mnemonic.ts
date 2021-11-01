import { Subject, from, merge } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { getMnemonicFromStorage, saveMnemonicToStorage } from './storage';
import { mnemonicWalletUnlock } from './mnemonicWalletUnlock';
import {
  activateAccount,
  addAccount,
  mnemonic$,
} from '@avalabs/wallet-react-components';

const _mnemonic = new Subject<{ mnemonic: string; password: string }>();

export const freshMnemonic = _mnemonic.pipe(
  switchMap(({ mnemonic, password }) => {
    return from(saveMnemonicToStorage(mnemonic, password)).pipe(
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
  switchMap(() => mnemonicWalletUnlock),
  map((state) => state.mnemonic)
);

/**
 * When a value emits, push it to the mnemonic subject in the SDK and that will kick off the wallet
 */
merge(mnemonicFromStorage, freshMnemonic).subscribe((mnemonic) => {
  mnemonic$.next(mnemonic);
  addAccount();
  activateAccount(0);
});

export function setMnemonicAndCreateWallet(mnem: string, password: string) {
  _mnemonic.next({ mnemonic: mnem, password });
}
