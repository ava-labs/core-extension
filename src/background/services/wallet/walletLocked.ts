import { Subject } from 'rxjs';

/**
 * This is a runtime state and is determined at runtime, doesnt need to be written
 */
export const walletLocked = new Subject<{ walletLocked: boolean }>();

export const mnemonicWalletUnlock = new Subject<{ mnemonic: string }>();
