import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { lockWallet } from '../../wallet/walletLocked';

export async function lockWalletFromSettings(
  request: ExtensionConnectionMessage
) {
  lockWallet.next(true);
  return {
    ...request,
    result: true,
  };
}
