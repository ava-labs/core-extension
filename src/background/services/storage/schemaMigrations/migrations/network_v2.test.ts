import network_v2 from './network_v2';

enum NewIDs {
  BITCOIN = 4503599627370475,
  BITCOIN_TESTNET = 4503599627370474,
}

describe('background/services/storage/schemaMigrations/migrations/network_v2', () => {
  const oldNetwork = {
    activeNetworkId: -1, //Bitcoin
    favoriteNetworks: [],
    customNetworks: {},
  };

  it.each([
    [-1, NewIDs.BITCOIN],
    [-2, NewIDs.BITCOIN_TESTNET],
  ])('can migrate activeNetwork', async (oldId, newId) => {
    const result = await network_v2.up({
      ...oldNetwork,
      activeNetworkId: oldId,
    });
    expect(result).toEqual({
      ...oldNetwork,
      activeNetworkId: newId,
      version: 2,
    });
  });

  it('can migrate favorite networks', async () => {
    const result = await network_v2.up({
      ...oldNetwork,
      favoriteNetworks: [-1, -2, 5, 6],
    });

    expect(result.favoriteNetworks).toEqual([
      NewIDs.BITCOIN,
      NewIDs.BITCOIN_TESTNET,
      5,
      6,
    ]);
  });
});
