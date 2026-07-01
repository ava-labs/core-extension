import {
  AvalancheChainIds,
  AvalancheMainnetBlockchainChainIds,
  Chain,
  TokenType,
} from '@avalabs/fusion-sdk';

import { formatAvalancheCctQuoteAddress } from './formatAvalancheCctQuoteAddress';

const buildChain = (chainId: Chain['chainId']): Chain => ({
  chainId,
  chainName: 'Avalanche',
  networkToken: {
    decimals: 9,
    name: 'AVAX',
    symbol: 'AVAX',
    type: TokenType.NATIVE,
  },
  rpcUrl: '',
});

describe('formatAvalancheCctQuoteAddress', () => {
  it('prefixes P-Chain XP addresses', () => {
    expect(
      formatAvalancheCctQuoteAddress(
        'avax1test',
        buildChain(AvalancheMainnetBlockchainChainIds.P),
      ),
    ).toBe('P-avax1test');
  });

  it('prefixes X-Chain XP addresses', () => {
    expect(
      formatAvalancheCctQuoteAddress(
        'avax1test',
        buildChain(AvalancheMainnetBlockchainChainIds.X),
      ),
    ).toBe('X-avax1test');
  });

  it('replaces the wrong XP address prefix for the requested chain', () => {
    expect(
      formatAvalancheCctQuoteAddress(
        'X-avax1test',
        buildChain(AvalancheMainnetBlockchainChainIds.P),
      ),
    ).toBe('P-avax1test');
  });

  it('leaves C-Chain EVM addresses unchanged', () => {
    expect(
      formatAvalancheCctQuoteAddress(
        '0x0123456789012345678901234567890123456789',
        buildChain(AvalancheChainIds.MAINNET),
      ),
    ).toBe('0x0123456789012345678901234567890123456789');
  });
});
