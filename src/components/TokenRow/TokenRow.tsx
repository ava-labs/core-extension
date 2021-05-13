import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface TokenRowProps {
  tokens: {
    name: string;
    symbol: string;
    denotation: number;
    balance: string;
    balanceParsed: string;
    address: string;
  };
}

export const TokenRow = (props: TokenRowProps) => {
  const { tokens } = props;

  return (
    <FlexContainer>
      {Object.entries(tokens).map(([key, value]: any) => {
        const { balanceParsed, symbol, name } = value;

        return (
          <Link
            to={{
              pathname: '/send',
              state: { ...value },
            }}
            className="coin"
          >
            <div className="name">
              <img
                src={
                  'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818'
                }
                alt=""
              />
              <div>
                {name}
                <br />
                <span>
                  {balanceParsed} {symbol}
                </span>
              </div>
            </div>

            <div className="price">
              $12.34
              {/* {formatCurrency(current_price, '$')} */}
              <br />
              {/* +$2.31 */}
            </div>
          </Link>
        );
      })}
    </FlexContainer>
  );
};

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  flex-basis: 100%;
  a {
    color: black;
  }
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
