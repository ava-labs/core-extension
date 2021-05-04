import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useStore } from '@src/store/store';

import { CoinRow } from '@src/components/CoinRow';
import { Layout } from '@src/components/Layout';

export const WalletHome = () => {
  const { onboardStore } = useStore();

  return (
    <Layout>
      <>
        <Balance>
          <div className='fiat'>$12.34</div>
          <div className='change'>+5.24%</div>
          <div className='actions'>
            <Link to='/deposit'>
              <button>Deposit</button>
            </Link>
            <Link to='/send'>
              <button>Send</button>
            </Link>
          </div>
        </Balance>
        <CoinRow />
        <CoinRow />
        <CoinRow />
      </>
    </Layout>
  );
};

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
