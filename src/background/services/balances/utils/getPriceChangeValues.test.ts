import { NetworkToken } from '@avalabs/core-chains-sdk';
import {
  NetworkTokenWithBalance,
  TokenType,
} from '@src/background/services/balances/models';
import BN from 'bn.js';
import { getPriceChangeValues } from './getPriceChangeValues';

describe('utils/getPriceChangeValues', () => {
  const networkToken1: NetworkToken = {
    name: 'network token 1',
    symbol: 'NT1',
    description: 'network tokwn for network 1',
    decimals: 12,
    logoUri: 'network.token.one.com',
  };

  const network1TokenBalance: NetworkTokenWithBalance = {
    ...networkToken1,
    type: TokenType.NATIVE,
    balance: new BN(100),
    balanceUSD: 3,
  };

  const priceChanges = {
    nt1: {
      priceChangePercentage: 100,
      priceChange: 1,
    },
  };

  it('should return the calculated changes', () => {
    const changes = getPriceChangeValues(
      network1TokenBalance.symbol,
      network1TokenBalance.balanceUSD,
      priceChanges
    );
    expect(changes).toEqual({
      value: 3,
      percentage: 100,
    });
  });
  it('should return an empty calculation because of the missing price changes', () => {
    const changes = getPriceChangeValues(
      network1TokenBalance.symbol,
      network1TokenBalance.balanceUSD
    );
    expect(changes).toEqual({
      value: 0,
      percentage: undefined,
    });
  });
  it('should return an empty calculation because of the missing balanceUSD value', () => {
    const changes = getPriceChangeValues(network1TokenBalance.symbol);
    expect(changes).toEqual({
      value: 0,
      percentage: undefined,
    });
  });
});
