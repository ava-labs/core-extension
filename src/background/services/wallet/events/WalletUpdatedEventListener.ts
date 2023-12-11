import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { WalletDetails, WalletEvents } from '../models';

export function walletStateChangedEventListener(
  evt: ExtensionConnectionEvent<WalletDetails | undefined>
) {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
