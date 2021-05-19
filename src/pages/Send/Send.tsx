import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';
import { Utils } from 'avalanche-wallet-sdk';

import { useStore } from '@src/store/store';

import { Layout } from '@src/components/Layout';
import { ContentLayout } from '@src/styles/styles';

export interface SendProps {
  name?: string;
  test?: string;
}

interface ERC20 {
  name: string;
  symbol: string;
  denomination: number;
  balance: string;
  balanceParsed: string;
  address: string;
}

export const Send = observer((props: SendProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { walletStore } = useStore();
  const { state: token }: any = useLocation();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAmount(value);
  };
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRecipient(value);
  };

  const isValid = typeof Utils.isValidAddress(recipient) === 'boolean';
  const canSend = amount && recipient && isValid;

  return (
    <Layout>
      <ContentLayout>
        <div className="content">
          <Wrapper>
            <SendDiv>
              <h1>Send {token.name}</h1>
              <div className="token">
                <img
                  src={
                    'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818'
                  }
                  alt=""
                />
              </div>

              <div className="address">
                <input
                  type="text"
                  onChange={handleRecipientChange}
                  placeholder={"Recipient's AVAX address"}
                />
              </div>
              <div className="amount">
                <input
                  type="number"
                  onChange={handleAmountChange}
                  placeholder={'Amount'}
                />
              </div>
              <div className="sendMax">
                Max:
                <span>
                  {token.balanceParsed} {token.symbol}
                </span>
              </div>
            </SendDiv>
          </Wrapper>
        </div>
        <div className="footer half-width">
          <Link to="/wallet">
            <button>Cancel</button>
          </Link>
          <Link
            to={{
              pathname: '/send/confirm',
              state: { ...token, amount, recipient },
            }}
          >
            <button disabled={!canSend}>Next</button>
          </Link>
        </div>
      </ContentLayout>
    </Layout>
  );
});

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
  .address {
    input {
      position: relative;
    }
  }
`;
