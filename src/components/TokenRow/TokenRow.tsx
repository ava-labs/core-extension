import React from 'react';
import { Link } from 'react-router-dom';
import { VerticalFlex } from '@avalabs/react-components';

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
    <VerticalFlex width={'100%'}>
      {Object.entries(tokens).map(
        ([key, { balanceParsed, symbol, name }]: any) => {
          return (
            <Link
              to={{
                pathname: '/send',
                state: { balanceParsed, symbol, name },
              }}
              className="coin"
              key={key}
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
        }
      )}
    </VerticalFlex>
  );
};
