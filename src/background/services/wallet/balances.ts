import {
  fromEventPattern,
  map,
  mapTo,
  merge,
  mergeMap,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';
import { wallet$ } from '@avalabs/wallet-react-components';
import {
  WalletBalanceX,
  iAvaxBalance,
  BN,
  Utils,
} from '@avalabs/avalanche-wallet-sdk';
import { walletInitializedFilter } from './utils/walletInitializedFilter';

export interface WalletBalances {
  balanceX: WalletBalanceX;
  balanceAvax: iAvaxBalance;
  balanceStaked: BN;
  balanceAvaxTotal: BN;
}

function getAvaxBalanceTotal(balanceAvax: iAvaxBalance, balanceStaked: BN) {
  // X Chain
  let xUnlocked = balanceAvax.X.unlocked;
  let xLocked = balanceAvax.X.locked;
  // P chain
  let pUnlocked: BN = balanceAvax.P.unlocked;
  let pLocked: BN = balanceAvax.P.locked;
  let pLockedStake: BN = balanceAvax.P.lockedStakeable;

  // C chain
  let cUnlocked = balanceAvax.C;

  let totX = xUnlocked.add(xLocked);
  let totP = pUnlocked.add(pLocked).add(pLockedStake).add(balanceStaked);
  let totC = Utils.avaxCtoX(cUnlocked);

  let totAvax = totX.add(totP).add(totC);
  return totAvax;
}

export const balanceUpdates = wallet$.pipe(
  walletInitializedFilter(),
  tap((wallet) => {
    wallet.updateUtxosX();
    wallet.updateUtxosP();
    wallet.updateAvaxBalanceC();
  }),
  switchMap((wallet) => {
    return merge(
      fromEventPattern(
        (handler) => wallet.on('balanceChangedX', handler),
        (handler) => wallet.off('balanceChangedX', handler)
      ),
      fromEventPattern(
        (handler) => wallet.on('balanceChangedC', handler),
        (handler) => wallet.off('balanceChangedC', handler)
      ),
      fromEventPattern(
        (handler) => wallet.on('balanceChangedP', handler),
        (handler) => wallet.off('balanceChangedP', handler)
      ),
      fromEventPattern(
        (handler) => wallet.on('addressChanged', handler),
        (handler) => wallet.off('addressChanged', handler)
      )
    ).pipe(throttleTime(500), mapTo(wallet));
  }),
  mergeMap((wallet) => {
    return Promise.all([Promise.resolve(wallet), wallet.getStake()]);
  }),
  map(([wallet, balanceStaked]): WalletBalances => {
    const balanceAvax = wallet.getAvaxBalance();

    return {
      balanceX: wallet.getBalanceX(),
      balanceAvax,
      balanceStaked: balanceStaked.staked,
      balanceAvaxTotal: getAvaxBalanceTotal(balanceAvax, balanceStaked.staked),
    };
  })
);
