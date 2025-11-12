import { NetworkToken } from '@avalabs/core-chains-sdk';
import { getPriceChangeValues } from './getPriceChangeValues';
import { NetworkTokenWithBalance, TokenType } from '@avalabs/vm-module-types';

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
    balance: 100n,
    balanceDisplayValue: '0.000001',
    coingeckoId: '',
    balanceInCurrency: 3,
  };

  const priceChanges = {
    nt1: {
      priceChangePercentage: 100,
      priceChange: 1,
    },
    avax: {
      priceChangePercentage: 100,
      priceChange: 1,
      currentPrice: 5,
    },
  };

  it('should return the calculated changes', () => {
    const changes = getPriceChangeValues(
      network1TokenBalance.symbol,
      network1TokenBalance.balanceInCurrency,
      priceChanges,
    );
    expect(changes).toEqual({
      value: 3,
      percentage: 100,
      currentPrice: undefined,
    });
  });
  it('should return an empty calculation because of the missing price changes', () => {
    const changes = getPriceChangeValues(
      network1TokenBalance.symbol,
      network1TokenBalance.balanceInCurrency,
    );
    expect(changes).toEqual({
      value: 0,
      percentage: undefined,
      currentPrice: undefined,
    });
  });
  it('should return an empty calculation because of the missing balanceInCurrency value', () => {
    const changes = getPriceChangeValues(network1TokenBalance.symbol);
    expect(changes).toEqual({
      value: 0,
      percentage: undefined,
      currentPrice: undefined,
    });
  });

  it('should return the calculated changes for AVAX', () => {
    const changes = getPriceChangeValues(
      'AVAX',
      network1TokenBalance.balanceInCurrency,
      priceChanges,
    );
    expect(changes).toEqual({
      value: 3,
      percentage: 100,
      currentPrice: 5,
    });
  });
});
