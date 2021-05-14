import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

import { useStore } from '@src/store/store';

import { Layout } from '@src/components/Layout';
import { ContentLayout } from '@src/styles/styles';

import { truncateAddress } from '@src/utils/addressUtils';

interface sendProps {
  address: string;
  amount: string;
  balance: string;
  balanceParsed: string;
  denomination: number;
  name: string;
  recipient: string;
  symbol: string;
}

export const SendConfirm = () => {
  const { walletStore } = useStore();

  const { state }: any = useLocation();
  const {
    address,
    amount,
    balance,
    balanceParsed,
    denomination,
    name,
    recipient,
    symbol,
  } = state;

  const sendTransaction = async () => {
    console.log('pressed');

    const txID = await walletStore.sendTransaction();
    console.log('txID in line 39', txID);
  };

  const truncatedAddress = truncateAddress(recipient);

  return (
    <Layout>
      <ContentLayout>
        <div className="content">
          <Wrapper>
            <SendDiv>
              <div className="token">
                <img
                  src={
                    'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818'
                  }
                  alt=""
                />
              </div>
              <h1>
                Send {amount} {symbol}
              </h1>

              <div>To: ({truncatedAddress})</div>
            </SendDiv>
          </Wrapper>
        </div>
        <div className="footer half-width">
          <Link to="/wallet">
            <button>Cancel</button>
          </Link>
          <Link to="/send/confirm" onClick={sendTransaction}>
            <button>Confirm</button>
          </Link>
        </div>
      </ContentLayout>
    </Layout>
  );
};

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const SendDiv = styled.div`
  margin: 0;
  padding: 0;
  h1 {
    text-align: center;
    font-size: 1.6rem;
    margin: 1rem;
  }
  .token {
    margin: 2rem auto;
    text-align: center;
    img {
      max-width: 4rem;
    }
  }
  input {
    width: 100%;
    margin: 1rem auto;
  }
  .sendMax {
    span {
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;
