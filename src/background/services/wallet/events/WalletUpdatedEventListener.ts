import { DerivationPath } from '@avalabs/wallets-sdk';
import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { WalletEvents, WalletType } from '../models';

export function walletStateChangedEventListener(
  evt: ExtensionConnectionEvent<{
    walletType?: WalletType;
    derivationPath?: DerivationPath;
  }>
) {
  return evt.name === WalletEvents.WALLET_STATE_UPDATE;
}
