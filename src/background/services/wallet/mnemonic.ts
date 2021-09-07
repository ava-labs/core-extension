import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';
import { Subject, from } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import { getOnboardingFromStorage } from '../onboarding/storage';
import { getMnemonicFromStorage, saveMnemonicToStorage } from './storage';
import { mnemonicWalletUnlock } from './mnemonicWalletUnlock';
import { mnemonic$ } from '@avalabs/wallet-react-components';

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
from(getOnboardingFromStorage())
  .pipe(
    switchMap((state) => {
      return state.isOnBoarded ? mnemonicFromStorage : freshMnemonic;
    })
  )
  .subscribe((mnemonic) => mnemonic$.next(mnemonic));

export function setMnemonicAndCreateWallet(mnem: string, password: string) {
  _mnemonic.next({ mnemonic: mnem, password });
}
