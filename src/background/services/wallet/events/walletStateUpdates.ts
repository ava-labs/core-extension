import { map } from 'rxjs';
import { walletState$ } from '../walletState';
import { WalletEvents } from './models';

export const walletUpdateEvents = walletState$.pipe(
  map((walletState) => {
    return {
      name: WalletEvents.WALLET_STATE_UPDATE,
      value: walletState,
    };
  })
);
