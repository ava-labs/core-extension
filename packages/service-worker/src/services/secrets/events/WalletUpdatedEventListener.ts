import {
  ExtensionConnectionEvent,
  WalletEvents,
  WalletDetails,
} from '@core/types';

export function walletStateChangedEventListener(
  evt: ExtensionConnectionEvent<WalletDetails[]>,
) {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
