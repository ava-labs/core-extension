import {
  ExtensionConnectionEvent,
  WalletEvents,
  WalletDetails,
} from '@core/types';

export function isWalletStateUpdateEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<WalletDetails[]> {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
