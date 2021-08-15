import { Subject } from 'rxjs';

export const mnemonicWalletUnlock = new Subject<{ mnemonic: string }>();
