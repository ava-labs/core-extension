import React from 'react';
import styled from 'styled-components';

export interface CoinRowProps {}

export const CoinRow = (props: CoinRowProps) => {
  const {} = props;

  return (
    <FlexContainer>
      <div className='coin'>
        <div className='name'>
          <img
            src={
              'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818'
            }
            alt=''
          />
          <div>
            Avalanche
            <br />
            <span>1.252352 AVAX</span>
          </div>
          11
        </div>

        <div className='price'>
          $12.34
          {/* {formatCurrency(current_price, '$')} */}
          <br />
          +$2.31
        </div>
      </div>
    </FlexContainer>
  );
};

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  flex-basis: 100%;
  .coin {
    cursor: pointer;
    max-width: 100%;
    border: 1px solid rgb(221, 221, 221);
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 1rem;
    display: inline-flex;
    justify-content: space-between;
    flex-basis: 100%;
    align-items: center;
    img {
      max-width: 44px;
      max-height: 44px;
      margin-right: 0.7rem;
    }
    .price {
      text-align: right;
      max-width: 80px;
      flex-basis: 80px;
    }
    .name {
      max-width: 240px;
      display: inline-flex;
      align-items: center;
      flex-basis: 240px;
      span {
        font-size: 0.7rem;
      }
    }
    .volume {
      max-width: 240px;
      flex-basis: 240px;
      text-align: right;
    }
    &:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
      transition: 0.2s ease-out;
    }
  }
`;
