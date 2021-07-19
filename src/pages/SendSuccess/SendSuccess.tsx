import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useStore } from '@src/store/store';
import { truncateAddress } from '@src/utils/addressUtils';
import { VerticalFlex } from '@avalabs/react-components';

export const SendSuccess = () => {
  const [loading, setIsLoading] = useState(false);
  const { walletStore } = useStore();

  const txHash = walletStore.lastTransactionSent;

  const truncatedTxHash = truncateAddress(txHash);

  return (
    <VerticalFlex>
      <div className="content">
        <Wrapper>
          <SendDiv>
            {txHash ? (
              <>
                <img src="/images/success.gif" alt="" />
                <div>
                  See your transaction
                  <a
                    target="_blank"
                    href={`https://testnet.avascan.info/blockchain/c/tx/${txHash}`}
                  >
                    {truncatedTxHash}
                  </a>
                </div>
              </>
            ) : (
              <>
                <h1>something went wrong</h1>
              </>
            )}
          </SendDiv>
        </Wrapper>
      </div>
      <div className="footer">
        <Link to="/wallet">
          <button>Home</button>
        </Link>
      </div>
    </VerticalFlex>
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
