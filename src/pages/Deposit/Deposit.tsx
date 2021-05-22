import React, { useState } from 'react';
import styled from 'styled-components';
import { QRCode } from 'react-qr-svg';
import { Link } from 'react-router-dom';

import { useStore } from '@src/store/store';

import { Layout } from '@src/components/Layout';
import { FullWidthButton } from '@src/styles/styles';

import { truncateAddress } from '@src/utils/addressUtils';

export const Deposit = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [chain, setChain] = useState('C');

  const { walletStore } = useStore();

  const getAddress = () => {
    if (chain === 'C') {
      return walletStore.addrC;
    } else if (chain === 'X') {
      return walletStore.addrX;
    } else if (chain === 'P') {
      return walletStore.addrP;
    }
    return walletStore.addrC;
  };

  const truncatedAddress = truncateAddress(getAddress());
  return (
    <Layout>
      <Wrapper>
        <QR>
          <h1>Select Chain to 'Receive' your coin</h1>
          <div className="selector">
            <span
              className={chain === 'X' ? 'active' : ''}
              onClick={() => setChain('X')}
            >
              X-Chain
            </span>
            <span
              className={chain === 'P' ? 'active' : ''}
              onClick={() => setChain('P')}
            >
              P-Chain
            </span>
            <span
              className={chain === 'C' ? 'active' : ''}
              onClick={() => setChain('C')}
            >
              C-Chain
            </span>
          </div>

          <div className="qr">
            <QRCode value={getAddress()} style={{ width: '100px' }} />
          </div>

          <div className="address">
            {truncatedAddress}
            <button
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(getAddress());
              }}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="disclaimer">
            This address can only be used to receive AVAX on the {chain} Chain.
          </div>

          <Link to="/wallet">
            <FullWidthButton>Close</FullWidthButton>
          </Link>
        </QR>
      </Wrapper>
    </Layout>
  );
};

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const QR = styled.div`
  .selector {
    display: inline-flex;
    justify-content: center;
    text-align: center;
    width: 100%;
    margin-bottom: 1rem;
    span {
      width: 75px;
      height: 26px;
      align-items: center;
      display: flex;
      justify-content: center;
      font-size: 11px;
      letter-spacing: -2%;
      margin: auto 0.4rem;
    }
    .active {
      background: #2d333a;
      border-radius: 50px;
    }
  }
  h1 {
    text-align: center;
    font-size: 1.6rem;
    margin: 1rem;
  }
  .qr {
    text-align: center;
  }
  .address {
    font-size: 1.2rem;
    padding: 1rem;
    margin: auto 2rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
