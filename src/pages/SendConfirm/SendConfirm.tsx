import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useStore } from '@src/store/store';

import { Layout } from '@src/components/Layout';
import { ContentLayout } from '@src/styles/styles';

import { truncateAddress } from '@src/utils/addressUtils';
export const SendConfirm = () => {
  const { onboardStore } = useStore();
  const exampleAddr: string = '0x860bf60f22563b473E2EAE475BbE655995023740';

  const truncatedAddress = truncateAddress(exampleAddr);
  return (
    <Layout>
      <ContentLayout>
        <div className='content'>
          <Wrapper>
            <SendDiv>
              <div className='token'>
                <img
                  src={
                    'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818'
                  }
                  alt=''
                />
              </div>
              <h1>Send 13.234235 AVAX</h1>

              <div>To: ({truncatedAddress})</div>
            </SendDiv>
          </Wrapper>
        </div>
        <div className='footer half-width'>
          <Link to='/wallet'>
            <button>Cancel</button>
          </Link>
          <Link to='/send/confirm'>
            <button>Next</button>
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
