import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { WalletDetails } from '../../wallet/models';
import { WalletEvents } from '../../wallet/models';

export function walletStateChangedEventListener(
  evt: ExtensionConnectionEvent<WalletDetails[]>,
) {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
