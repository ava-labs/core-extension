import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ConnectionRequestHandler } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$ } from '../../wallet/wallet';

export async function initDappState(data) {
  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...data,
      result: {
        isUnlocked: true,
        networkVersion: 'avax',
        accounts: [],
        chainId: '',
      },
    };
  }

  return {
    ...data,
    result: {
      isUnlocked: true,
      chainId: walletResult.getAddressC(),
      networkVersion: 'avax',
      accounts: getAccountsFromWallet(walletResult),
    },
  };
}

export const InitDappStateRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.INIT_DAPP_STATE, initDappState];
