import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@src/store/store';

import { Layout } from '@src/components/Layout';

import { Utils } from 'avalanche-wallet-sdk';

export const WalletOverview = observer(() => {
  const { walletStore } = useStore();

  const UpdateWallet = () => {
    walletStore.updateWallet();
    walletStore.updateBalance();
  };

  const getStakingAmount = () => {
    return walletStore.stakeAmountClean();
  };

  useEffect(() => {
    const update = async () => {};
  }, []);

  console.log('walletStore', walletStore);
  const { balanceX, balanceP } = walletStore;

  console.log('balancex', balanceP);

  const xLocked = Utils.bnToAvaxX(balanceX.locked);
  const xUnlocked = Utils.bnToAvaxX(balanceX.unlocked);
  const pLocked = Utils.bnToAvaxP(balanceP.locked);
  const pUnlocked = Utils.bnToAvaxP(balanceP.unlocked);
  const pLockedStakeable = Utils.bnToAvaxP(balanceP.lockedStakeable);

  const grandTotal = walletStore.getGrandTotal();

  return (
    <Layout>
      <>
        <Overview>
          <div className="fiat">Total - {grandTotal} AVAX </div>
          <div className="fiat"> C - {walletStore.balanceC} AVAX</div>
          <div className="fiat">P - {pUnlocked} AVAX</div>
          <div className="fiat">X - {xUnlocked} AVAX</div>
          <div className="fiat">X locked - {xLocked}</div>
          <div className="fiat">P locked - {pLocked}</div>
          <div className="fiat">P locked stakeable- {pLockedStakeable}</div>
          <div className="fiat">Staking - {getStakingAmount()}</div>
        </Overview>
      </>
    </Layout>
  );
});

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const Overview = styled.div`
  .fiat {
    text-align: center;
    font-size: 1.42rem;
  }
  .change {
    text-align: center;
    color: green;
  }
  .actions {
    display: flex;
    justify-content: center;
    button {
      margin: 1rem 0.4rem;
    }
  }
`;
