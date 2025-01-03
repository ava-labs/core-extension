import { ChainId } from '@avalabs/core-chains-sdk';

import { ChainListWithCaipIds } from '@src/background/services/network/models';

import { getIncludedNetworks } from './getIncludedNetworks';

describe('src/background/services/balances/handlers/getTotalBalanceForWallet/helpers/getIncludedNetworks', () => {
  const favoriteNetworks = [ChainId.BITCOIN, ChainId.ETHEREUM_TEST_SEPOLIA];

  describe('for mainnet environment', () => {
    const mainnets = {
      [ChainId.AVALANCHE_MAINNET_ID]: {},
      [ChainId.AVALANCHE_X]: {},
      [ChainId.AVALANCHE_P]: {},
      [ChainId.ETHEREUM_HOMESTEAD]: {},
      [ChainId.BITCOIN]: {},
    } as unknown as ChainListWithCaipIds;

    it('always adds C-, X- and P-Chain mainnets', () => {
      expect(getIncludedNetworks(true, mainnets, [])).toEqual([
        ChainId.AVALANCHE_MAINNET_ID,
        ChainId.AVALANCHE_P,
        ChainId.AVALANCHE_X,
      ]);
    });

    it('adds favorite networks', () => {
      expect(getIncludedNetworks(true, mainnets, favoriteNetworks)).toEqual([
        ChainId.AVALANCHE_MAINNET_ID,
        ChainId.AVALANCHE_P,
        ChainId.AVALANCHE_X,
        ChainId.BITCOIN,
      ]);
    });
  });

  describe('for mainnet environment', () => {
    const testnets = {
      [ChainId.AVALANCHE_TESTNET_ID]: {},
      [ChainId.AVALANCHE_TEST_X]: {},
      [ChainId.AVALANCHE_TEST_P]: {},
      [ChainId.ETHEREUM_TEST_SEPOLIA]: {},
      [ChainId.BITCOIN_TESTNET]: {},
    } as unknown as ChainListWithCaipIds;

    it('always adds testnet C-, X- and P-Chain', () => {
      expect(getIncludedNetworks(false, testnets, [])).toEqual([
        ChainId.AVALANCHE_TESTNET_ID,
        ChainId.AVALANCHE_TEST_P,
        ChainId.AVALANCHE_TEST_X,
      ]);
    });

    it('adds favorite networks', () => {
      expect(getIncludedNetworks(false, testnets, favoriteNetworks)).toEqual([
        ChainId.AVALANCHE_TESTNET_ID,
        ChainId.AVALANCHE_TEST_P,
        ChainId.AVALANCHE_TEST_X,
        ChainId.ETHEREUM_TEST_SEPOLIA,
      ]);
    });
  });
});
