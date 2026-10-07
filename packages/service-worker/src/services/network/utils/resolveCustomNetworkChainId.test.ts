import { resolveCustomNetworkChainId } from './resolveCustomNetworkChainId';

describe('resolveCustomNetworkChainId', () => {
  it('uses the chainId when it is the only identifier', () => {
    expect(resolveCustomNetworkChainId({ chainId: 43114 })).toBe(43114);
    expect(resolveCustomNetworkChainId({ chainId: '43114' })).toBe(43114);
  });

  it('derives the chainId from the caipId', () => {
    expect(resolveCustomNetworkChainId({ caipId: 'eip155:43114' })).toBe(43114);
  });

  it('accepts both identifiers when they agree', () => {
    expect(
      resolveCustomNetworkChainId({
        chainId: 43114,
        caipId: 'eip155:43114',
      }),
    ).toBe(43114);
  });

  it('rejects identifiers that disagree', () => {
    expect(() =>
      resolveCustomNetworkChainId({ chainId: 43114, caipId: 'eip155:1' }),
    ).toThrow('chainId does not match caipId');
  });

  it('rejects a missing or unusable identifier', () => {
    expect(() => resolveCustomNetworkChainId({})).toThrow(
      'Network is missing a usable chain ID',
    );
    expect(() =>
      resolveCustomNetworkChainId({ chainId: 'not-a-chain-id' }),
    ).toThrow('Network is missing a usable chain ID');
    expect(() => resolveCustomNetworkChainId({ chainId: 0 })).toThrow(
      'Network is missing a usable chain ID',
    );
    expect(() => resolveCustomNetworkChainId({ chainId: -1 })).toThrow(
      'Network is missing a usable chain ID',
    );
    expect(() => resolveCustomNetworkChainId({ chainId: 1.5 })).toThrow(
      'Network is missing a usable chain ID',
    );
  });
});
