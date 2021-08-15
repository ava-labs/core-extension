import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { walletState } from '../walletState';

export async function initializeWalletState(
  request: ExtensionConnectionMessage
) {
  const result = await firstValueFrom(walletState);

  return {
    ...request,
    result,
  };
}
