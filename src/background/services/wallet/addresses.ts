import { map } from 'rxjs';
import { wallet } from './wallet';

export const addressUpdates = wallet.pipe(
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
