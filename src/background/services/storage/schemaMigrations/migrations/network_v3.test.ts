import network_v3 from './network_v3';

enum NewIDs {
  AVALANCHE_P = 4503599627370471,
  AVALANCHE_TEST_P = 4503599627370470,
}

enum OldIDs {
  AVALANCHE_XP = 4503599627370473,
  AVALANCHE_TEST_XP = 4503599627370472,
}

describe('background/services/storage/schemaMigrations/migrations/network_v3', () => {
  const oldNetwork = {
    activeNetworkId: 4503599627370472, //AVALANCHE_TEST_XP
    favoriteNetworks: [],
    customNetworks: {},
  };

  it.each([
    [OldIDs.AVALANCHE_XP, NewIDs.AVALANCHE_P],
    [OldIDs.AVALANCHE_TEST_XP, NewIDs.AVALANCHE_TEST_P],
  ])('can migrate activeNetwork', async (oldId, newId) => {
    const result = await network_v3.up({
      ...oldNetwork,
      activeNetworkId: oldId,
    });
    expect(result).toEqual({
      ...oldNetwork,
      activeNetworkId: newId,
      version: 3,
    });
  });

  it('can migrate favorite networks', async () => {
    const result = await network_v3.up({
      ...oldNetwork,
      favoriteNetworks: [OldIDs.AVALANCHE_XP, OldIDs.AVALANCHE_TEST_XP, 5, 6],
    });

    expect(result.favoriteNetworks).toEqual([
      NewIDs.AVALANCHE_P,
      NewIDs.AVALANCHE_TEST_P,
      5,
      6,
    ]);
  });
});
