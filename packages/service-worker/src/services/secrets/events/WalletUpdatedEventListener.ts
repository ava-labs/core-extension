import { ExtensionConnectionEvent } from '../../../connections/models';
import { WalletDetails, WalletEvents } from '../../wallet/models';

export function walletStateChangedEventListener(
  evt: ExtensionConnectionEvent<WalletDetails[]>,
) {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
