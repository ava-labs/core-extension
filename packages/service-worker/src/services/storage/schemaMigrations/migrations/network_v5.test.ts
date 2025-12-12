import { ChainId } from '@avalabs/core-chains-sdk';
import network_v5, { defaultEnableNetworksDeletable } from './network_v5';
import { NETWORKS_ENABLED_FOREVER } from '@core/types';

describe('background/services/storage/schemaMigrations/migrations/network_v5', () => {
  const baseNetworkStorage = {
    favoriteNetworks: [],
    customNetworks: {},
    dappScopes: {},
  };

  describe('basic migration', () => {
    it('should add version 5 and networkAvailability object', async () => {
      const result = await network_v5.up(baseNetworkStorage);

      expect(result.version).toBe(5);
      expect(result.networkAvailability).toBeDefined();
      expect(typeof result.networkAvailability).toBe('object');
    });
  });

  describe('networkAvailability creation', () => {
    it('should include defaultEnableNetworksDeletable in networkAvailability when not in favoriteNetworks', async () => {
      const result = await network_v5.up(baseNetworkStorage);
      expect(Object.keys(result.networkAvailability)).toHaveLength(
        defaultEnableNetworksDeletable.length,
      );
      defaultEnableNetworksDeletable.forEach((networkId) => {
        expect(result.networkAvailability[networkId]).toEqual({
          isEnabled: true,
        });
      });
    });

    it('should include custom networks from favoriteNetworks that are not in default lists', async () => {
      const customNetworkIds = [9999, 8888];
      const input = {
        ...baseNetworkStorage,
        favoriteNetworks: [...customNetworkIds, ...NETWORKS_ENABLED_FOREVER],
      };

      const result = await network_v5.up(input);

      expect(Object.keys(result.networkAvailability)).toHaveLength(
        customNetworkIds.length + defaultEnableNetworksDeletable.length,
      );

      customNetworkIds.forEach((networkId) => {
        expect(result.networkAvailability[networkId]).toEqual({
          isEnabled: true,
        });
      });
    });

    it('should filter out NETWORKS_ENABLED_FOREVER from favoriteNetworks but include defaultEnableNetworksDeletable', async () => {
      const customNetworkIds = [9999, 8888];
      const input = {
        ...baseNetworkStorage,
        favoriteNetworks: [
          ...customNetworkIds,
          ...NETWORKS_ENABLED_FOREVER,
          ...defaultEnableNetworksDeletable,
        ],
      };

      const result = await network_v5.up(input);

      // Should include custom networks
      customNetworkIds.forEach((networkId) => {
        expect(result.networkAvailability[networkId]).toEqual({
          isEnabled: true,
        });
      });

      // Should include defaultEnableNetworksDeletable
      defaultEnableNetworksDeletable.forEach((networkId) => {
        expect(result.networkAvailability[networkId]).toEqual({
          isEnabled: true,
        });
      });

      // Should NOT include NETWORKS_ENABLED_FOREVER
      NETWORKS_ENABLED_FOREVER.forEach((networkId) => {
        expect(result.networkAvailability[networkId]).toBeUndefined();
      });
    });
  });

  describe('favoriteNetworks handling', () => {
    it('should preserve favoriteNetworks array unchanged', async () => {
      const favoriteNetworks = [9999, 8888, ChainId.ETHEREUM_HOMESTEAD, 42161];
      const input = {
        ...baseNetworkStorage,
        favoriteNetworks,
      };

      const result = await network_v5.up(input);

      expect(result.favoriteNetworks).toEqual(favoriteNetworks);
    });
  });

  describe('edge cases', () => {
    it('should handle favoriteNetworks with only NETWORKS_ENABLED_FOREVER', async () => {
      const input = {
        ...baseNetworkStorage,
        favoriteNetworks: [...NETWORKS_ENABLED_FOREVER],
      };

      const result = await network_v5.up(input);

      // Should only have defaultEnableNetworksDeletable in networkAvailability
      expect(Object.keys(result.networkAvailability)).toHaveLength(
        defaultEnableNetworksDeletable.length,
      );

      defaultEnableNetworksDeletable.forEach((networkId) => {
        expect(result.networkAvailability[networkId]).toEqual({
          isEnabled: true,
        });
      });
    });

    it('should handle favoriteNetworks with only defaultEnableNetworksDeletable', async () => {
      const input = {
        ...baseNetworkStorage,
        favoriteNetworks: [...defaultEnableNetworksDeletable],
      };

      const result = await network_v5.up(input);

      // Should have defaultEnableNetworksDeletable in networkAvailability
      expect(Object.keys(result.networkAvailability)).toHaveLength(
        defaultEnableNetworksDeletable.length,
      );

      defaultEnableNetworksDeletable.forEach((networkId) => {
        expect(result.networkAvailability[networkId]).toEqual({
          isEnabled: true,
        });
      });
    });
  });
});
