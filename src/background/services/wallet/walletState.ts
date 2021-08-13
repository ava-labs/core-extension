import { combineLatest, map, shareReplay, switchMap, tap } from 'rxjs';
import { erc20TokenList } from '../erc20Tokens/erc20Tokens';
import { network } from '../network/handlers';
import { addressUpdates } from './addresses';
import { avaxPriceUpdates } from './avaxPrice';
import { balanceUpdates } from './balances';
import { WalletState } from './models';
import { wallet } from './wallet';
import { walletLocked } from './walletLocked';

function mapToWalletState(result): WalletState {
  return result.reduce((acc, value) => {
    return { ...acc, ...value };
  }, {});
}

function toStructure(name: any) {
  return (observer: any) => {
    return observer.pipe(map((value) => ({ [name]: value })));
  };
}

function toLogger(name: any) {
  return (observer: any) => {
    // return observer.pipe(tap((value) => console.log(name, value)));
    return observer;
  };
}

export const walletState = walletLocked.pipe(
  switchMap((state) => {
    return state.walletLocked
      ? Promise.resolve({ locked: true })
      : combineLatest([wallet, network]).pipe(
          switchMap(() =>
            combineLatest([
              addressUpdates.pipe(
                toStructure('addresses'),
                toLogger('addresses')
              ),
              erc20TokenList.pipe(
                toStructure('erc20Tokens'),
                toLogger('erc20Tokens')
              ),
              avaxPriceUpdates.pipe(
                toStructure('avaxPrice'),
                toLogger('avaxPrice')
              ),
              balanceUpdates.pipe(
                toStructure('balances'),
                toLogger('balances')
              ),
            ])
          ),
          map(mapToWalletState)
        );
  }),
  shareReplay()
);
