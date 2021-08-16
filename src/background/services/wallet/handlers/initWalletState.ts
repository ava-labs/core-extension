import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
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

export const GetWalletStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.WALLET_STATE, initializeWalletState];
