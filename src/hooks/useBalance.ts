import { useEffect, useState } from 'react';

import {
  WalletBalanceX,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk/dist/Wallet/types';
import { useBalanceAvax } from './useBalanceAvax';

export function useBalance(
  wallet?: WalletType
  // networkConfig?: SELECTEDNETWORK
) {
  const [balanceX, setBalanceX] = useState<WalletBalanceX>({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    balanceAvax,
    updateAvaxBalance,
    balanceStaked,
    updateBalanceStaked,
    balanceAvaxTotal,
    getAvaxBalanceUSD,
    getAvaxBalanceTotal,
  } = useBalanceAvax(wallet);

  function updateAllBalances() {
    if (!wallet) return;
    setIsLoading(true);
    Promise.all([
      wallet.updateUtxosX(),
      wallet.updateUtxosP(),
      wallet.updateAvaxBalanceC(),
    ]).then((res) => {
      setIsLoading(false);
    });
  }

  async function updateBalanceX() {
    if (!wallet) return;

    let val = wallet.getBalanceX();
    setBalanceX(val);
  }

  useEffect(() => {
    function balanceChangeX(val: any) {
      console.log('Balance change X');
      updateBalanceX();
      // TODO: Move this to a handler for p chain?
      updateBalanceStaked();
      updateAvaxBalance();
    }

    function balanceChangeC(val: any) {
      console.log('Balance change C');
      updateAvaxBalance();
      // updateErc20Balances();
    }

    function balanceChangeP() {
      updateAvaxBalance();
      updateBalanceStaked();
    }

    function onAddressChange() {
      console.log('Address change');

      updateBalanceX();
    }

    wallet?.on('balanceChangedX', balanceChangeX);
    wallet?.on('balanceChangedC', balanceChangeC);
    wallet?.on('balanceChangedP', balanceChangeP);
    wallet?.on('addressChanged', onAddressChange);

    return () => {
      wallet?.off('balanceChangedX', balanceChangeX);
      wallet?.off('balanceChangedC', balanceChangeC);
      wallet?.off('balanceChangedP', balanceChangeP);
      wallet?.off('addressChanged', onAddressChange);
    };
  }, [wallet]);

  return {
    balanceX,
    balanceAvax,
    balanceAvaxTotal,
    getAvaxBalanceUSD,
    balanceStaked,
    isLoading,
    getAvaxBalanceTotal,
    updateAllBalances,
  };
}
