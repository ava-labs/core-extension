import { Blockchain } from '@avalabs/core-bridge-sdk';
import { findTokenForAsset } from './findTokenForAsset';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { BN } from 'bn.js';

describe('src/pages/Bridge/utils/findTokenForAsset', () => {
  const token: TokenWithBalance = {
    type: TokenType.ERC20,
    balance: new BN(0),
    address: '0x000',
    contractType: 'ERC-20',
    name: 'Wrapped ETH',
    symbol: 'WETH.e',
    decimals: 1,
  };

  it('returns wrapped token for ethereum', () => {
    const result = findTokenForAsset('WETH', Blockchain.ETHEREUM, [
      token,
      { ...token, symbol: 'USDC', name: 'USDC' },
    ]);

    expect(result).toEqual(token);
  });

  it('returns wrapped token for bitcoin', () => {
    const result = findTokenForAsset('BTC', Blockchain.BITCOIN, [
      token,
      { ...token, symbol: 'BTC.b', name: 'Bitcoin' },
      { ...token, symbol: 'USDC', name: 'USDC' },
    ]);

    expect(result).toEqual({ ...token, symbol: 'BTC.b', name: 'Bitcoin' });
  });

  it('returns native token', () => {
    const result = findTokenForAsset('ETH', Blockchain.ETHEREUM, [
      token,
      { ...token, symbol: 'BTC.b', name: 'Bitcoin' },
      {
        ...token,
        type: TokenType.NATIVE,
        symbol: 'ETH',
        name: 'Ether',
        description: '',
        logoUri: '',
      },
    ]);

    expect(result).toEqual({
      ...token,
      type: TokenType.NATIVE,
      symbol: 'ETH',
      name: 'Ether',
      description: '',
      logoUri: '',
    });
  });

  it('returns undefined when token is not found', () => {
    const result = findTokenForAsset('ASDF', Blockchain.ETHEREUM, [
      token,
      { ...token, symbol: 'BTC.b', name: 'Bitcoin' },
      {
        ...token,
        type: TokenType.NATIVE,
        symbol: 'ETH',
        name: 'Ether',
        description: '',
        logoUri: '',
      },
    ]);

    expect(result).toBeUndefined();
  });
});
