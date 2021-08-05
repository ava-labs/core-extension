import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { firstValueFrom, map } from 'rxjs';
import { ERC20 } from '../erc20Tokens/models';
import { WalletBalances } from './balances';
import { walletState } from './walletState';

export interface WalletState {
  balances: WalletBalances;
  addresses: {
    addrX: string;
    addrP: string;
    addrC: string;
  };
  erc20Tokens: ERC20[];
  avaxPrice: number;
}

export async function initializeWalletState(
  request: ExtensionConnectionMessage
) {
  const result = await firstValueFrom(walletState);

  return {
    ...request,
    result,
  };
}

const WALLET_UPDATE_EVENT = 'wallet-updated';
export const walletUpdateEvents = walletState.pipe(
  map((walletState) => {
    return {
      name: WALLET_UPDATE_EVENT,
      value: walletState,
    };
  })
);

export function walletUpdatedEventListener(
  evt: ExtensionConnectionEvent<WalletState>
) {
  return evt.name === WALLET_UPDATE_EVENT;
}
