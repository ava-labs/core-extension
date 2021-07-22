import { useEffect, useState } from 'react';
import {
  iAvaxBalance,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk/dist/Wallet/types';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';

export function useBalanceAvax(wallet?: WalletType) {
  const [balanceAvax, setBalanceAvax] = useState<iAvaxBalance>({
    X: {
      locked: new BN(0),
      unlocked: new BN(0),
    },
    P: {
      locked: new BN(0),
      unlocked: new BN(0),
      lockedStakeable: new BN(0),
    },
    C: new BN(0),
  });
  const [balanceStaked, setBalanceStaked] = useState<BN>(new BN(0));

  // Sum of ALL AVAX tokens.
  const [balanceAvaxTotal, setBalanceAvaxTotal] = useState<BN>(new BN(0));

  // Gets the balance from the SDK into the the reactive state
  function updateAvaxBalance() {
    if (!wallet) return;
    let bal = wallet.getAvaxBalance();
    console.log('updateAvaxBalance: ', bal);
    setBalanceAvax(bal);
  }

  async function updateBalanceStaked() {
    if (!wallet) return;
    let stake = await wallet.getStake();
    console.log('updateBalanceStaked: ', stake);
    setBalanceStaked(stake);
  }

  useEffect(() => {
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
    setBalanceAvaxTotal(totAvax);
  }, [balanceAvax, balanceStaked]);

  function getAvaxBalanceUSD(avaxUSD: number) {
    console.log('getAvaxBalanceUSD');
    return Utils.bnToLocaleString(balanceAvaxTotal.mul(new BN(avaxUSD)), 9);
  }
  function getAvaxBalanceTotal() {
    console.log('getAvaxBalanceTotal');
    return Utils.bnToLocaleString(balanceAvaxTotal, 9);
  }

  return {
    balanceAvax,
    updateAvaxBalance,
    balanceAvaxTotal,
    balanceStaked,
    updateBalanceStaked,
    getAvaxBalanceUSD,
    getAvaxBalanceTotal,
  };
}
