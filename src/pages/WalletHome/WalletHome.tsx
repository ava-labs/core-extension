import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@src/store/store';

import { TokenRow } from '@src/components/TokenRow';
import { Layout } from '@src/components/Layout';

interface ERC20 {
  name: string;
  symbol: string;
  denomination: number;
  balance: string;
  balanceParsed: string;
  address: string;
}

export const WalletHome = observer(() => {
  const { walletStore } = useStore();

  const UpdateWallet = () => {
    walletStore.updateWallet();
    walletStore.updateBalance();
  };

  const getCBalance = () => {
    walletStore.balCClean();
  };

  const AVAX: ERC20 = {
    name: 'Avalanche',
    symbol: 'AVAX',
    denomination: 18,
    balance: 'de0b6b3a7640000',
    balanceParsed: walletStore.balanceC,
    address: '0x34B6C87bb59Eb37EFe35C8d594a234Cd8C654D50',
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
            <Link
              to={{
                pathname: '/send',
                state: AVAX,
              }}
            >
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
