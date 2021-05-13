import React, { useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';

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
  const [canPaste, setCanPaste] = useState(false);
  const { walletStore } = useStore();
  let location = useLocation();
  console.log(location);
  const token: ERC20 | any = location.state;

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
                <input placeholder={"Recipient's AVAX address"} />
                {canPaste && <> Icon </>}
              </div>
              <div className="amount">
                <input placeholder={'Amount'} />
              </div>
              <div className="sendMax">
                Max:
                <span>
                  {token.balanceParsed} {token.symbol}
                </span>
              </div>

              <div className="disclaimer">
                This address can only be used to receive AVAX on the __ Chain.
              </div>
            </SendDiv>
          </Wrapper>
        </div>
        <div className="footer half-width">
          <Link to="/wallet">
            <button>Cancel</button>
          </Link>
          <Link to="/send/confirm">
            <button>Next</button>
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
`;
