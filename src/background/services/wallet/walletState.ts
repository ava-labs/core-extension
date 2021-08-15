import { formatAndLog, toLogger } from '@src/background/utils/logging';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { erc20TokenList } from '../erc20Tokens/erc20Tokens';
import { network } from '../network/handlers';
import { addressUpdates } from './addresses';
import { avaxPriceUpdates } from './avaxPrice';
import { balanceUpdates } from './balances';
import { WalletLockedState, WalletState } from './models';
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

export const walletState = new BehaviorSubject<
  WalletState | WalletLockedState | undefined
>(undefined);

const showLogs = false;

walletLocked
  .pipe(
    switchMap((state) => {
      return state && state.locked
        ? Promise.resolve({ locked: true })
        : combineLatest([wallet, network]).pipe(
            switchMap(() =>
              combineLatest([
                addressUpdates.pipe(
                  toStructure('addresses'),
                  toLogger('addresses', showLogs)
                ),
                erc20TokenList.pipe(
                  toStructure('erc20Tokens'),
                  toLogger('erc20Tokens', showLogs)
                ),
                avaxPriceUpdates.pipe(
                  toStructure('avaxPrice'),
                  toLogger('avaxPrice', showLogs)
                ),
                balanceUpdates.pipe(
                  toStructure('balances'),
                  toLogger('balances', showLogs)
                ),
              ])
            ),
            map(mapToWalletState)
          );
    })
  )
  .subscribe((state) => {
    formatAndLog('wallet state', state);
    walletState.next(state);
  });
