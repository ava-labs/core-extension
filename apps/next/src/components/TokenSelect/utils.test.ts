import { ChainId } from '@avalabs/core-chains-sdk';

import {
  getAvalancheChainPriority,
  getChainFilterName,
  sortChainIds,
} from './utils';

describe('TokenSelect utils', () => {
  describe('sortChainIds', () => {
    it('places Avalanche C-Chain, P-Chain, and X-Chain before other chains in that order', () => {
      expect(
        [
          ChainId.ETHEREUM_HOMESTEAD,
          ChainId.AVALANCHE_X,
          ChainId.AVALANCHE_P,
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.BITCOIN,
        ].toSorted(sortChainIds),
      ).toEqual([
        ChainId.AVALANCHE_MAINNET_ID,
        ChainId.AVALANCHE_P,
        ChainId.AVALANCHE_X,
        ChainId.ETHEREUM_HOMESTEAD,
        ChainId.BITCOIN,
      ]);
    });

    it('applies the same Avalanche order for testnet chain IDs', () => {
      expect(
        [
          ChainId.ETHEREUM_TEST_SEPOLIA,
          ChainId.AVALANCHE_TEST_X,
          ChainId.AVALANCHE_TEST_P,
          ChainId.AVALANCHE_TESTNET_ID,
        ].toSorted(sortChainIds),
      ).toEqual([
        ChainId.AVALANCHE_TESTNET_ID,
        ChainId.AVALANCHE_TEST_P,
        ChainId.AVALANCHE_TEST_X,
        ChainId.ETHEREUM_TEST_SEPOLIA,
      ]);
    });
  });

  describe('getAvalancheChainPriority', () => {
    it('returns priority values for Avalanche primary networks', () => {
      expect(getAvalancheChainPriority(ChainId.AVALANCHE_MAINNET_ID)).toBe(0);
      expect(getAvalancheChainPriority(ChainId.AVALANCHE_P)).toBe(1);
      expect(getAvalancheChainPriority(ChainId.AVALANCHE_X)).toBe(2);
    });

    it('returns -1 for non-Avalanche primary networks', () => {
      expect(getAvalancheChainPriority(ChainId.BITCOIN)).toBe(-1);
    });
  });

  describe('getChainFilterName', () => {
    it('returns CCT chain names for Avalanche primary networks', () => {
      expect(getChainFilterName(ChainId.AVALANCHE_MAINNET_ID)).toBe('C-Chain');
      expect(getChainFilterName(ChainId.AVALANCHE_P)).toBe('P-Chain');
      expect(getChainFilterName(ChainId.AVALANCHE_X)).toBe('X-Chain');
    });

    it('returns the fallback name for other networks', () => {
      expect(getChainFilterName(ChainId.BITCOIN, 'Bitcoin')).toBe('Bitcoin');
    });
  });
});
