import { TokenType } from '@avalabs/vm-module-types';

import { parseUniqueTokenId } from './parseUniqueTokenId';

describe('parseUniqueTokenId', () => {
  it('parses a native token id', () => {
    expect(parseUniqueTokenId('NATIVE:avax:43114')).toEqual({
      type: TokenType.NATIVE,
      identifier: 'avax',
      coreChainId: 43114,
    });
  });

  it('parses an ERC20 token id', () => {
    expect(
      parseUniqueTokenId(
        'ERC20:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e:43114',
      ),
    ).toEqual({
      type: TokenType.ERC20,
      identifier: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
      coreChainId: 43114,
    });
  });

  it('parses an SPL token id preserving the address case', () => {
    expect(
      parseUniqueTokenId(
        'SPL:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:4503599627370471',
      ),
    ).toEqual({
      type: TokenType.SPL,
      identifier: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      coreChainId: 4503599627370471,
    });
  });

  it('parses a hypercore spot token id', () => {
    expect(parseUniqueTokenId('HYPERCORE_SPOT:spot:150:1337')).toEqual({
      type: TokenType.HYPERCORE_SPOT,
      identifier: 'spot:150',
      coreChainId: 1337,
    });
  });

  it.each([
    ['empty', ''],
    ['no separators', 'NATIVE'],
    ['a single separator', 'NATIVE:43114'],
    ['an unknown type', 'FOO:avax:43114'],
    ['an empty identifier', 'NATIVE::43114'],
    ['a non-numeric chain id', 'NATIVE:avax:abc'],
    ['a missing chain id', 'NATIVE:avax:'],
  ])('returns undefined for %s', (_, id) => {
    expect(parseUniqueTokenId(id)).toBeUndefined();
  });
});
