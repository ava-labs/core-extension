import network_v6 from './network_v6';

describe('background/services/storage/schemaMigrations/migrations/network_v6', () => {
  const baseNetworkStorage = {
    customNetworks: {},
    dappScopes: {},
    networkAvailability: {},
  };

  it('should add version 6', async () => {
    const result = await network_v6.up(baseNetworkStorage);

    expect(result.version).toBe(6);
  });

  it('should add avalancheDevnetMode with default values', async () => {
    const result = await network_v6.up(baseNetworkStorage);

    expect(result.avalancheDevnetMode).toEqual({
      enabled: false,
      rpcUrl: 'http://localhost:9650',
      explorerUrl: 'https://explorer-xp.avax-dev.network/',
    });
  });

  it('should preserve existing storage properties', async () => {
    const input = {
      customNetworks: {
        9999: { chainId: 9999, chainName: 'Custom' },
      },
      dappScopes: {
        'https://example.com': 'eip155:1',
      },
      networkAvailability: {
        1: { isEnabled: true },
        43114: { isEnabled: false },
      },
    } as unknown as Parameters<typeof network_v6.up>[0];

    const result = await network_v6.up(input);

    expect(result.customNetworks).toEqual(input.customNetworks);
    expect(result.dappScopes).toEqual(input.dappScopes);
    expect(result.networkAvailability).toEqual(input.networkAvailability);
  });

  it('should not override existing properties with devnet defaults', async () => {
    const input = {
      ...baseNetworkStorage,
      customNetworks: { 1: { chainId: 1 } },
    } as unknown as Parameters<typeof network_v6.up>[0];

    const result = await network_v6.up(input);

    expect(result.customNetworks).toEqual({ 1: { chainId: 1 } });
    expect(result.avalancheDevnetMode.enabled).toBe(false);
  });
});
