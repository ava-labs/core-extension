import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { mapV2NetworksToChainList } from './mapV2Networks';

const apiNetwork = (overrides: Record<string, unknown> = {}) => ({
  chainId: 43114,
  chainName: 'Avalanche C-Chain',
  caip2Id: 'eip155:43114',
  description: null,
  explorerUrl: 'https://snowtrace.io',
  isTestnet: false,
  isAlwaysEnabled: true,
  isEnabledByDefault: true,
  logoUri: 'https://logo/avax',
  networkToken: {
    name: 'Avalanche',
    decimals: 18,
    symbol: 'AVAX',
    internalId: 'NATIVE-avax',
    description: null,
    logoUri: 'https://logo/avax-token',
  },
  pricingProviders: {
    coingecko: { nativeTokenId: 'avalanche-2', assetPlatformId: 'avalanche' },
  },
  primaryColor: '#E84142',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  wsUrl: null,
  subnetExplorerUriId: 'c-chain',
  vmName: 'EVM',
  utilityAddresses: { multicall: '0xmulticall' },
  platformChainId: null,
  subnetId: null,
  vmId: null,
  ...overrides,
});

describe('mapV2NetworksToChainList', () => {
  it('re-keys CAIP-2 entries by numeric chainId and maps core fields', () => {
    const result = mapV2NetworksToChainList({
      'eip155:43114': apiNetwork() as any,
    });

    expect(Object.keys(result)).toEqual(['43114']);
    expect(result[43114]).toMatchObject({
      chainId: 43114,
      chainName: 'Avalanche C-Chain',
      caip2Id: 'eip155:43114',
      vmName: NetworkVMType.EVM,
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      explorerUrl: 'https://snowtrace.io',
      isTestnet: false,
      networkToken: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
        description: '',
        logoUri: 'https://logo/avax-token',
      },
      utilityAddresses: { multicall: '0xmulticall' },
    });
  });

  it('preserves the API enablement flags', () => {
    const result = mapV2NetworksToChainList({
      'eip155:43114': apiNetwork({
        isAlwaysEnabled: false,
        isEnabledByDefault: true,
      }) as any,
    });

    expect(result[43114]?.isAlwaysEnabled).toBe(false);
    expect(result[43114]?.isEnabledByDefault).toBe(true);
  });

  it('normalizes nullable logoUri and native-token description', () => {
    const result = mapV2NetworksToChainList({
      'eip155:43114': apiNetwork({
        logoUri: null,
        networkToken: {
          name: 'X',
          symbol: 'X',
          decimals: 18,
          internalId: 'x',
          description: null,
          logoUri: null,
        },
      }) as any,
    });

    expect(result[43114]?.logoUri).toBe('');
    expect(result[43114]?.networkToken.description).toBe('');
    expect(result[43114]?.networkToken.logoUri).toBe('');
  });

  it('skips networks without an rpc url (e.g. X/P-Chain, injected locally)', () => {
    const result = mapV2NetworksToChainList({
      'eip155:43114': apiNetwork() as any,
      'avax:pchain': apiNetwork({
        chainId: 111111,
        rpcUrl: null,
        caip2Id: 'avax:pchain',
      }) as any,
    });

    expect(Object.keys(result)).toEqual(['43114']);
  });

  it('skips networks without a native token', () => {
    const result = mapV2NetworksToChainList({
      'eip155:1': apiNetwork({ chainId: 1, networkToken: null }) as any,
    });

    expect(result).toEqual({});
  });

  it('skips networks with an unrecognized vmName', () => {
    const result = mapV2NetworksToChainList({
      'eip155:43114': apiNetwork() as any,
      'eip155:1': apiNetwork({
        chainId: 1,
        caip2Id: 'eip155:1',
        vmName: 'TOTALLY_UNKNOWN_VM',
      }) as any,
    });

    expect(Object.keys(result)).toEqual(['43114']);
  });
});
