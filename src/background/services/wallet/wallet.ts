import { combineLatest } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { createMnemonicWallet, mnemonic } from './mnemonic';
import { isMnemonicWallet } from './models';

export const wallet = combineLatest([
  mnemonic.pipe(
    map((mnemonic) => {
      return createMnemonicWallet(mnemonic);
    })
  ),
]).pipe(
  map(([mnemonicWallet]) => mnemonicWallet),
  tap(async (wallet) => {
    isMnemonicWallet(wallet)
      ? await wallet.resetHdIndices(
          wallet.getExternalIndex(),
          wallet.getInternalIndex()
        )
      : await Promise.reject('cant resetHdIndices on this type of wallet');

    await wallet.updateUtxosX();
    await wallet.updateUtxosP();
  }),
  shareReplay()
);
