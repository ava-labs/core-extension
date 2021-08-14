import { map, filter, OperatorFunction } from 'rxjs';
import { WalletType } from '@avalabs/avalanche-wallet-sdk';
import { wallet } from './wallet';
import { walletInitializedFilter } from './utils/walletInitializedFilter';

export const addressUpdates = wallet.pipe(
  walletInitializedFilter(),
  map((wallet) => {
    let addrX = wallet.getAddressX();
    let addrP = wallet.getAddressP();
    let addrC = wallet.getAddressC();
    return {
      addrX,
      addrP,
      addrC,
    };
  })
);
