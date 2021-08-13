import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom, map } from 'rxjs';
import { WalletLockedState, WalletState } from './models';
import { decryptMnemonicInStorage } from './storage';
import { mnemonicWalletUnlock } from './walletLocked';
import { walletState } from './walletState';

export async function initializeWalletState(
  request: ExtensionConnectionMessage
) {
  const result = await firstValueFrom(walletState);

  return {
    ...request,
    result,
  };
}

export async function unlockWalletState(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: new Error('params missing from request'),
    };
  }

  const password = params.pop();

  if (!password) {
    return {
      ...request,
      error: new Error('password missing for request'),
    };
  }

  const [decryptedMnemonic, err] = await resolve(
    decryptMnemonicInStorage(password)
  );

  if (err) {
    return {
      ...request,
      error: err,
    };
  }
  mnemonicWalletUnlock.next({ mnemonic: decryptedMnemonic });

  return {
    ...request,
    result: true,
  };
}

const WALLET_UPDATE_EVENT = 'wallet-updated';
export const walletUpdateEvents = walletState.pipe(
  map((walletState) => {
    return {
      name: WALLET_UPDATE_EVENT,
      value: walletState,
    };
  })
);

export function walletUpdatedEventListener(
  evt: ExtensionConnectionEvent<WalletState | WalletLockedState>
) {
  return evt.name === WALLET_UPDATE_EVENT;
}
