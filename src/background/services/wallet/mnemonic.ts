import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';
import { formatAndLog } from '@src/background/utils/logging';
import { Subject, from } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import { getOnboardingFromStorage } from '../onboarding/storage';
import { getMnemonicFromStorage, saveMnemonicToStorage } from './storage';
import { mnemonicWalletUnlock } from './mnemonicWalletUnlock';

const _mnemonic = new Subject<{ mnemonic: string; password: string }>();

export const freshMnemonic = _mnemonic.pipe(
  switchMap(({ mnemonic, password }) => {
    return from(saveMnemonicToStorage(mnemonic, password)).pipe(
      tap(() => formatAndLog('mnemonic encrypted in storage', true)),
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
  tap(() => formatAndLog('waiting on wallet unlock', true)),
  switchMap(() => mnemonicWalletUnlock),
  map((state) => state.mnemonic)
);

export const mnemonic = from(getOnboardingFromStorage()).pipe(
  switchMap((state) => {
    return state.isOnBoarded ? mnemonicFromStorage : freshMnemonic;
  })
);

export function createMnemonicWallet(mnemonic: string) {
  return MnemonicWallet.fromMnemonic(mnemonic);
}

export function setMnemonicAndCreateWallet(mnem: string, password: string) {
  _mnemonic.next({ mnemonic: mnem, password });
}
