import { renderHook } from '@testing-library/react';
import { TokenInfo, useTokenInfoContext } from '@avalabs/core-bridge-sdk';
import { useCoinGeckoId } from './useCoinGeckoId';

jest.mock('@avalabs/core-bridge-sdk', () => ({
  useTokenInfoContext: jest.fn(),
}));

describe('hooks/useGetRequestId', () => {
  const tokenInfo: TokenInfo = {
    logo: 'test logo',
    coingeckoId: 'test coingeckoId',
  };
  const tokenSymbol = 'TEST';

  const tokenInfoData = { [tokenSymbol]: tokenInfo };
  beforeEach(() => {
    jest.resetAllMocks();
    (useTokenInfoContext as jest.Mock).mockReturnValue(tokenInfoData);
  });

  it('returns known id when the symbol is known', () => {
    const { result } = renderHook(() => useCoinGeckoId('BTC'));
    expect(result.current).toBe('bitcoin');
  });

  it('returns undefined if tokenInfo is undefined', () => {
    (useTokenInfoContext as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useCoinGeckoId(tokenSymbol));
    expect(result.current).toBe(undefined);
  });

  it('returns the expected id when the symbol is found in tokenInfo', () => {
    const { result } = renderHook(() => useCoinGeckoId(tokenSymbol));
    expect(result.current).toBe(tokenInfo.coingeckoId);
  });

  it('returns undefined when the symbol is known', () => {
    const { result } = renderHook(() => useCoinGeckoId('HOORAY'));
    expect(result.current).toBe(undefined);
  });
  it('returns undefined when the symbol is missing', () => {
    const { result } = renderHook(() => useCoinGeckoId());
    expect(result.current).toBe(undefined);
  });
});
