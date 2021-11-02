import { firstValueFrom, map, switchMap } from 'rxjs';
import { network$ } from '@avalabs/wallet-react-components';
import { walletInitializedFilter } from '../../wallet/utils/walletInitializedFilter';
import { wallet$ } from '@avalabs/wallet-react-components';
import { Web3Event } from './models';

export function chainChangedEvents() {
  return wallet$.pipe(
    walletInitializedFilter(),
    switchMap((wallet) =>
      Promise.all([Promise.resolve(wallet), firstValueFrom(network$)])
    ),
    map(([wallet, net]) => {
      return {
        chainId: net?.chainId,
        networkVersion: wallet.getAddressC(),
      };
    }),
    map((params) => ({
      method: Web3Event.CHAIN_CHANGED,
      params,
    }))
  );
}
