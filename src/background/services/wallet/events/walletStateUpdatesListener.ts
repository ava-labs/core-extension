import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { WalletLockedState, WalletState } from '../models';
import { WalletEvents } from './models';

export function walletUpdatedEventListener(
  evt: ExtensionConnectionEvent<WalletState | WalletLockedState>
) {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
