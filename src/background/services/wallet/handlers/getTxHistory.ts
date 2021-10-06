import { wallet$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { filter, firstValueFrom } from 'rxjs';
import { walletLocked$ } from '../walletLocked';

export async function getWalletHistory(request: ExtensionConnectionMessage) {
  const [limit = 50] = request.params || [];

  await firstValueFrom(walletLocked$.pipe(filter((state) => !state?.locked)));

  const wallet = await firstValueFrom(wallet$);

  if (!wallet) {
    return {
      ...request,
      error: 'wallet missing or malformed',
    };
  }

  const items = await wallet.getHistory(limit);

  return {
    ...request,
    result: { items, limit },
  };
}

export const GetWalletHistoryRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.GET_WALLET_HISTORY, getWalletHistory];
