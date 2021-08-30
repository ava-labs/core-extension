import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { wallet$ } from '../../wallet/wallet';

export async function eth_getBalance(data: ExtensionConnectionMessage) {
  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...data,
      error: 'wallet undefined',
    };
  }

  return { ...data, result: walletResult.getAddressC() };
}

export const EthGetBalanceRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.ETH_GET_BALANCE, eth_getBalance];
