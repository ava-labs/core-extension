import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { WalletEvents, WalletLockedState } from '../models';
import { WalletState } from '@avalabs/wallet-react-components';

export function walletUpdatedEventListener(
  evt: ExtensionConnectionEvent<WalletState | WalletLockedState>
) {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
