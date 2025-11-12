import { DefiProtocol, DefiItemType } from '@core/types';
import { sortProtocols } from './sortProtocols';

describe('sortProtocols utility', () => {
  const createMockProtocol = (
    id: string,
    name: string,
    totalUsdValue: number,
    chainName?: string,
    groupNames: string[] = [],
  ): DefiProtocol => ({
    id,
    name,
    siteUrl: `https://${id}.com`,
    logoUrl: `https://logo.com/${id}.png`,
    totalUsdValue,
    chainName,
    groups: groupNames.map((groupName) => ({
      name: groupName,
      totalUsdValue: 100,
      items: [
        {
          type: DefiItemType.Common,
          name: groupName,
          netUsdValue: 100,
          supplyTokens: [],
          rewardTokens: [],
        },
      ],
    })),
  });

  const mockProtocols: DefiProtocol[] = [
    createMockProtocol('uniswap', 'Uniswap', 3000, 'Ethereum', [
      'Liquidity Pool',
    ]),
    createMockProtocol('aave', 'Aave', 5000, 'Avalanche C-Chain', ['Lending']),
    createMockProtocol('compound', 'Compound', 2000, 'Ethereum', ['Lending']),
    createMockProtocol('sushiswap', 'SushiSwap', 4000, 'Polygon', [
      'Liquidity Pool',
    ]),
    createMockProtocol('curve', 'Curve', 1000, 'Arbitrum', ['Liquidity Pool']),
  ];

  describe('sortProtocols with null or None option', () => {
    it('returns protocols unchanged when sortOption is null', () => {
      const result = sortProtocols(mockProtocols, null);

      expect(result).toEqual(mockProtocols);
    });

    it('returns protocols unchanged when sortOption is None', () => {
      const result = sortProtocols(mockProtocols, 'none');

      expect(result).toEqual(mockProtocols);
    });

    it('does not mutate the original array', () => {
      const original = [...mockProtocols];
      sortProtocols(mockProtocols, 'name-asc');

      expect(mockProtocols).toEqual(original);
    });
  });

  describe('sortProtocols by name in ascending order', () => {
    it('sorts protocols by name alphabetically (A to Z)', () => {
      const result = sortProtocols(mockProtocols, 'name-asc');

      expect(result.map((p) => p.name)).toEqual([
        'Aave',
        'Compound',
        'Curve',
        'SushiSwap',
        'Uniswap',
      ]);
    });

    it('handles protocols with same name correctly', () => {
      const protocolsWithDuplicates = [
        createMockProtocol('protocol1', 'Protocol A', 1000),
        createMockProtocol('protocol2', 'Protocol A', 2000),
        createMockProtocol('protocol3', 'Protocol B', 3000),
      ];

      const result = sortProtocols(protocolsWithDuplicates, 'name-asc');

      expect(result[0]?.name).toBe('Protocol A');
      expect(result[1]?.name).toBe('Protocol A');
      expect(result[2]?.name).toBe('Protocol B');
    });

    it('is case-insensitive when sorting', () => {
      const mixedCaseProtocols = [
        createMockProtocol('lower', 'aave', 1000),
        createMockProtocol('upper', 'COMPOUND', 2000),
        createMockProtocol('mixed', 'Uniswap', 3000),
      ];

      const result = sortProtocols(mixedCaseProtocols, 'name-asc');

      // localeCompare is case-insensitive by default
      expect(result.map((p) => p.name)).toEqual([
        'aave',
        'COMPOUND',
        'Uniswap',
      ]);
    });
  });

  describe('sortProtocols by name in descending order', () => {
    it('sorts protocols by name reverse alphabetically (Z to A)', () => {
      const result = sortProtocols(mockProtocols, 'name-desc');

      expect(result.map((p) => p.name)).toEqual([
        'Uniswap',
        'SushiSwap',
        'Curve',
        'Compound',
        'Aave',
      ]);
    });

    it('handles single protocol correctly', () => {
      const singleProtocol = [createMockProtocol('single', 'Single', 1000)];
      const result = sortProtocols(singleProtocol, 'name-desc');

      expect(result).toEqual(singleProtocol);
    });

    it('handles empty array correctly', () => {
      const result = sortProtocols([], 'name-desc');

      expect(result).toEqual([]);
    });
  });

  describe('sortProtocols by amount in descending order', () => {
    it('sorts protocols by totalUsdValue from highest to lowest', () => {
      const result = sortProtocols(mockProtocols, 'amount-desc');

      expect(result.map((p) => p.totalUsdValue)).toEqual([
        5000, // Aave
        4000, // SushiSwap
        3000, // Uniswap
        2000, // Compound
        1000, // Curve
      ]);
    });

    it('handles protocols with same amount correctly', () => {
      const protocolsWithSameAmount = [
        createMockProtocol('protocol1', 'Protocol A', 1000),
        createMockProtocol('protocol2', 'Protocol B', 1000),
        createMockProtocol('protocol3', 'Protocol C', 2000),
      ];

      const result = sortProtocols(protocolsWithSameAmount, 'amount-desc');

      expect(result[0]?.totalUsdValue).toBe(2000);
      expect(result[1]?.totalUsdValue).toBe(1000);
      expect(result[2]?.totalUsdValue).toBe(1000);
    });

    it('handles zero and negative values correctly', () => {
      const protocolsWithVariedValues = [
        createMockProtocol('zero', 'Zero', 0),
        createMockProtocol('positive', 'Positive', 100),
        createMockProtocol('negative', 'Negative', -50),
      ];

      const result = sortProtocols(protocolsWithVariedValues, 'amount-desc');

      expect(result.map((p) => p.totalUsdValue)).toEqual([100, 0, -50]);
    });
  });

  describe('sortProtocols by protocol', () => {
    it('sorts protocols by their group names', () => {
      const protocolsWithDifferentGroups = [
        createMockProtocol('protocol1', 'Protocol A', 1000, 'Ethereum', [
          'Staking',
        ]),
        createMockProtocol('protocol2', 'Protocol B', 2000, 'Ethereum', [
          'Lending',
        ]),
        createMockProtocol('protocol3', 'Protocol C', 3000, 'Ethereum', [
          'Liquidity Pool',
        ]),
      ];

      const result = sortProtocols(
        protocolsWithDifferentGroups,
        'protocol-asc',
      );

      // Groups are sorted alphabetically: Lending, Liquidity Pool, Staking
      expect(result[0]?.groups[0]?.name).toBe('Lending');
      expect(result[1]?.groups[0]?.name).toBe('Liquidity Pool');
      expect(result[2]?.groups[0]?.name).toBe('Staking');
    });

    it('handles protocols with multiple groups', () => {
      const protocolsWithMultipleGroups = [
        createMockProtocol('protocol1', 'Protocol A', 1000, 'Ethereum', [
          'Staking',
          'Lending',
        ]),
        createMockProtocol('protocol2', 'Protocol B', 2000, 'Ethereum', [
          'Liquidity Pool',
        ]),
      ];

      const result = sortProtocols(protocolsWithMultipleGroups, 'protocol-asc');

      // Protocol A has groups: Lending,Staking (sorted)
      // Protocol B has groups: Liquidity Pool
      // "Lending,Staking" comes before "Liquidity Pool" alphabetically
      expect(result[0]?.name).toBe('Protocol A');
      expect(result[1]?.name).toBe('Protocol B');
    });
  });

  describe('sortProtocols by network', () => {
    it('prioritizes Avalanche chains first', () => {
      const result = sortProtocols(mockProtocols, 'network-asc');

      // Aave is on Avalanche C-Chain, so it should be first
      expect(result[0]?.chainName).toBe('Avalanche C-Chain');
    });

    it('sorts non-Avalanche chains alphabetically after Avalanche chains', () => {
      const result = sortProtocols(mockProtocols, 'network-asc');

      const nonAvalancheProtocols = result.slice(1); // Skip the Avalanche one
      const chainNames = nonAvalancheProtocols.map((p) => p.chainName);

      // Should be sorted alphabetically: Arbitrum, Ethereum, Ethereum, Polygon
      expect(chainNames).toEqual([
        'Arbitrum',
        'Ethereum',
        'Ethereum',
        'Polygon',
      ]);
    });

    it('handles protocols without chainName', () => {
      const protocolsWithoutChain = [
        createMockProtocol('protocol1', 'Protocol A', 1000, undefined),
        createMockProtocol('protocol2', 'Protocol B', 2000, 'Ethereum'),
        createMockProtocol('protocol3', 'Protocol C', 3000, 'Avalanche'),
      ];

      const result = sortProtocols(protocolsWithoutChain, 'network-asc');

      // Avalanche should be first, then protocols are sorted by chainName
      expect(result[0]?.chainName).toBe('Avalanche');
      // Empty string ('') comes before 'Ethereum' in localeCompare
      expect(result[1]?.chainName).toBeUndefined();
      expect(result[2]?.chainName).toBe('Ethereum');
    });

    it('handles case-insensitive Avalanche detection', () => {
      const protocolsWithVariedAvalanche = [
        createMockProtocol('protocol1', 'Protocol A', 1000, 'avalanche'),
        createMockProtocol(
          'protocol2',
          'Protocol B',
          2000,
          'AVALANCHE C-CHAIN',
        ),
        createMockProtocol('protocol3', 'Protocol C', 3000, 'Ethereum'),
      ];

      const result = sortProtocols(protocolsWithVariedAvalanche, 'network-asc');

      // Both Avalanche protocols should come before Ethereum
      expect(result[0]?.chainName?.toLowerCase()).toContain('avalanche');
      expect(result[1]?.chainName?.toLowerCase()).toContain('avalanche');
      expect(result[2]?.chainName).toBe('Ethereum');
    });
  });

  describe('Edge cases', () => {
    it('handles empty protocols array', () => {
      const result = sortProtocols([], 'name-asc');

      expect(result).toEqual([]);
    });

    it('handles single protocol', () => {
      const singleProtocol = [createMockProtocol('single', 'Single', 1000)];
      const result = sortProtocols(singleProtocol, 'amount-desc');

      expect(result).toEqual(singleProtocol);
    });

    it('returns a new array instance', () => {
      const result = sortProtocols(mockProtocols, 'name-asc');

      expect(result).not.toBe(mockProtocols);
    });

    it('handles protocols with special characters in names', () => {
      const specialProtocols = [
        createMockProtocol('protocol1', 'Protocol-A', 1000),
        createMockProtocol('protocol2', 'Protocol_B', 2000),
        createMockProtocol('protocol3', 'Protocol.C', 3000),
      ];

      const result = sortProtocols(specialProtocols, 'name-asc');

      // Should sort correctly with special characters
      expect(result.length).toBe(3);
      expect(result.map((p) => p.id)).toContain('protocol1');
      expect(result.map((p) => p.id)).toContain('protocol2');
      expect(result.map((p) => p.id)).toContain('protocol3');
    });
  });
});
