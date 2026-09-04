import { mapApiTokenToContractToken } from './mapApiToken';

const apiToken = (overrides: Record<string, unknown> = {}) => ({
  address: '0xAbC',
  name: 'Token',
  symbol: 'TKN',
  decimals: 18,
  isNative: false,
  logoUri: 'https://logo',
  isVerified: true,
  contractType: 'ERC-20' as const,
  networkCaip2Id: 'eip155:43114',
  ...overrides,
});

describe('mapApiTokenToContractToken', () => {
  it('maps an EVM ERC-20 token and preserves isVerified', () => {
    expect(mapApiTokenToContractToken(apiToken())).toEqual({
      address: '0xAbC',
      name: 'Token',
      symbol: 'TKN',
      decimals: 18,
      contractType: 'ERC-20',
      logoUri: 'https://logo',
      isVerified: true,
    });
  });

  it('drops native tokens', () => {
    expect(
      mapApiTokenToContractToken(apiToken({ isNative: true })),
    ).toBeUndefined();
  });

  it('drops tokens without an address', () => {
    expect(
      mapApiTokenToContractToken(apiToken({ address: '' })),
    ).toBeUndefined();
  });

  it('defaults null contractType to ERC-20 on EVM chains', () => {
    expect(
      mapApiTokenToContractToken(apiToken({ contractType: null }))
        ?.contractType,
    ).toBe('ERC-20');
  });

  it('defaults null contractType to SPL on Solana chains', () => {
    expect(
      mapApiTokenToContractToken(
        apiToken({
          contractType: null,
          networkCaip2Id: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
        }),
      )?.contractType,
    ).toBe('SPL');
  });

  it('normalizes null logoUri and missing isVerified', () => {
    const mapped = mapApiTokenToContractToken(
      apiToken({ logoUri: null, isVerified: undefined }),
    );
    expect(mapped?.logoUri).toBeUndefined();
    expect(mapped?.isVerified).toBeNull();
  });
});
