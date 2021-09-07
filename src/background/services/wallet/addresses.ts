import { map } from 'rxjs';
import { wallet$ } from '@avalabs/wallet-react-components';
import { walletInitializedFilter } from './utils/walletInitializedFilter';

export const addressUpdates = wallet$.pipe(
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
