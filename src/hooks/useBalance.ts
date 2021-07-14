import { useEffect, useState } from 'react';
import { Big, Utils } from '@avalabs/avalanche-wallet-sdk';

import {
  iAvaxBalance,
  WalletBalanceERC20,
  WalletBalanceX,
} from '@avalabs/avalanche-wallet-sdk/dist/Wallet/types';

export function useBalance(wallet, networkConfig) {
  const [balanceX, setBalanceX] = useState<WalletBalanceX>({});
  const [balanceERC20, setBalanceERC20] = useState<WalletBalanceERC20>({});
  const [balanceAvax, setBalanceAvax] = useState<iAvaxBalance>();
  const [balanceAvaxTotal, setBalanceAvaxTotal] = useState<Big>(Big(0));
  /**
   * Need to get this working so that when network is changed we show that we are
   * refreshing the balances. The UI right now show kinda updates after some time
   * and its not obvious.
   * @link https://ava-labs.atlassian.net/browse/PM-212
   */
  const [refreshingBalances, setRefreshingBalances] = useState(false);

  function updateBalanceErc20() {
    if (!wallet) return;
    setBalanceERC20(wallet.balanceERC20);
  }

  async function updateBalanceX() {
    if (!wallet) return;

    let val = wallet.getBalanceX();
    setBalanceX(val);
  }

  function updateAvaxBalance() {
    if (!wallet) return;
    let bal = wallet.getAvaxBalance();
    setBalanceAvax(bal);
    updateTotalAvax();
  }

  function updateTotalAvax() {
    if (!wallet) return;
    let balanceAvax = wallet.getAvaxBalance();
    let xUnlocked = balanceAvax.X.unlocked;
    let xLocked = balanceAvax.X.locked;
    let pUnlocked = balanceAvax.P.unlocked;
    let pLocked = balanceAvax.P.locked;
    let pLockedStake = balanceAvax.P.lockedStakeable;
    let cUnlocked = balanceAvax.C;

    let totX = Utils.bnToBigAvaxX(xUnlocked.add(xLocked));
    let totP = Utils.bnToBigAvaxP(pUnlocked.add(pLocked).add(pLockedStake));
    let totC = Utils.bnToAvaxC(cUnlocked);

    let totAvax = totX.add(totP).add(totC);
    setBalanceAvaxTotal(totAvax);
  }

  useEffect(() => {
    if (!wallet) return;
    function balanceChangeX(val: any) {
      updateBalanceX();
      updateAvaxBalance();
    }

    function balanceChangeC(val: any) {
      updateAvaxBalance();
      updateBalanceErc20();
    }

    function onAddressChange() {
      updateBalanceX();
    }

    wallet.on('balanceChangedX', balanceChangeX);
    wallet.on('balanceChangedC', balanceChangeC);
    wallet.on('addressChanged', onAddressChange);

    return () => {
      wallet.off('balanceChangedX', balanceChangeX);
      wallet.off('balanceChangedC', balanceChangeC);
      wallet.off('addressChanged', onAddressChange);
    };
  }, [wallet]);

  useEffect(() => {
    return () => {
      updateAvaxBalance();
      updateBalanceErc20();
      updateBalanceX();
    };
  }, [networkConfig.selected]);

  useEffect(() => {
    if (!wallet) return;
    wallet.getUtxosX();
    updateBalanceErc20();
    updateBalanceX();
  }, []);

  return {
    balanceX,
    balanceAvax,
    balanceAvaxTotal,
    balanceERC20,
    refreshingBalances,
  };
}
