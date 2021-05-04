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
  const { onboardStore } = useStore();
  const exampleAddr: string = '0x860bf60f22563b473E2EAE475BbE655995023740';
  const truncatedAddress = truncateAddress(exampleAddr);
  return (
    <Layout>
      <Wrapper>
        <QR>
          <h1>Deposit AVAX</h1>
          <div className='qr'>
            <QRCode value={exampleAddr} style={{ width: '100px' }} />
          </div>

          <div className='address'>
            {truncatedAddress}
            <button
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(exampleAddr);
              }}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className='disclaimer'>
            This address can only be used to receive AVAX on the __ Chain.
          </div>

          <Link to='/wallet'>
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
    background: grey;
    padding: 1rem;
    margin: 2rem auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
