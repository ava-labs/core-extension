import { formatAndLog } from '@src/utils/logging';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WalletType } from '../../../../../avalanche-wallet-sdk-internal/dist';
import { createMnemonicWallet, mnemonic } from './mnemonic';
import { isMnemonicWallet } from './models';

export const wallet = new BehaviorSubject<WalletType | undefined>(undefined);

combineLatest([
  mnemonic.pipe(
    map((mnemonic) => {
      return createMnemonicWallet(mnemonic);
    })
  ),
])
  .pipe(
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
    })
  )
  .subscribe((result) => {
    formatAndLog('wallet initialized', result);
    wallet.next(result);
  });
