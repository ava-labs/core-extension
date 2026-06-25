import { renderHook } from '@testing-library/react';

import { useTypedDataChainMismatch } from './useTypedDataChainMismatch';

const getNetwork = jest.fn();

jest.mock('@core/ui', () => ({
  useNetworkContext: () => ({ getNetwork }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      key.replace(/{{(\w+)}}/g, (_, name) => String(opts?.[name] ?? '')),
  }),
}));

const network = { chainId: 43114, chainName: 'Avalanche C-Chain' } as never;

const typedDataForChain = (chainId: number) => ({
  primaryType: 'Permit',
  domain: { name: 'USD Coin', chainId },
  message: {},
});

describe('useTypedDataChainMismatch', () => {
  beforeEach(() => {
    getNetwork.mockReset();
  });

  it('returns undefined when the domain chainId matches the signing network', () => {
    const { result } = renderHook(() =>
      useTypedDataChainMismatch(typedDataForChain(43114), network),
    );
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when there is no domain chainId', () => {
    const { result } = renderHook(() =>
      useTypedDataChainMismatch(
        { primaryType: 'Permit', domain: {}, message: {} },
        network,
      ),
    );
    expect(result.current).toBeUndefined();
  });

  it('names the mismatched network when it is known', () => {
    getNetwork.mockReturnValue({ chainName: 'Ethereum' });
    const { result } = renderHook(() =>
      useTypedDataChainMismatch(typedDataForChain(1), network),
    );
    expect(getNetwork).toHaveBeenCalledWith(1);
    expect(result.current).toContain('Ethereum');
    expect(result.current).toContain('Avalanche C-Chain');
  });

  it('falls back to the chain ID when the network is unknown', () => {
    getNetwork.mockReturnValue(undefined);
    const { result } = renderHook(() =>
      useTypedDataChainMismatch(typedDataForChain(999), network),
    );
    expect(result.current).toContain('999');
    expect(result.current).toContain('Avalanche C-Chain');
  });
});
