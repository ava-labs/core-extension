import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@src/store/store';

import { TokenRow } from '@src/components/TokenRow';
import { Layout } from '@src/components/Layout';

export const WalletHome = observer(() => {
  const { walletStore } = useStore();

  const UpdateWallet = () => {
    walletStore.updateWallet();
    walletStore.updateBalance();
  };

  const getCBalance = () => {
    walletStore.balCClean();
  };

  useEffect(() => {
    const update = async () => {
      await UpdateWallet();
      await getCBalance();
    };
    setTimeout(function () {
      update();
    }, 3200);
  }, []);

  const test = walletStore.ERC20Tokens;
  console.log('hmmm', test);
  return (
    <Layout>
      <>
        <Balance>
          <div className="fiat"> {walletStore.balanceC} AVAX</div>
          {/* <div className="fiat">$12.34</div> */}
          {/* <div className="change">+5.24%</div> */}
          <div className="actions">
            <Link to="/deposit">
              <button>Deposit</button>
            </Link>
            <Link to="/send">
              <button>Send</button>
            </Link>
          </div>
        </Balance>
        <TokenRow tokens={walletStore.balanceERC20} />
      </>
    </Layout>
  );
});

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const Balance = styled.div`
  .fiat {
    text-align: center;
    font-size: 2rem;
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
