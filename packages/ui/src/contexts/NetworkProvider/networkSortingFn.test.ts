import { ChainId } from '@avalabs/core-chains-sdk';
import { Network } from '@core/types';
import { promoteAvalancheNetworks } from './networkSortingFn';

describe('contexts/NetworkProvider/networkSortingFn', () => {
  describe('promoteAvalancheNetworks', () => {
    // Helper function to create mock network objects
    const createMockNetwork = (chainId: number): Network =>
      ({
        chainId,
      }) as Network;

    describe('when both networks are Avalanche networks', () => {
      it('should prioritize C-Chain over P-Chain', () => {
        const cChainNetwork = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
        const pChainNetwork = createMockNetwork(ChainId.AVALANCHE_P);

        const testArray = [pChainNetwork, cChainNetwork];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([cChainNetwork, pChainNetwork]);
      });

      it('should prioritize C-Chain over X-Chain', () => {
        const cChainNetwork = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
        const xChainNetwork = createMockNetwork(ChainId.AVALANCHE_X);

        const testArray = [xChainNetwork, cChainNetwork];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([cChainNetwork, xChainNetwork]);
      });

      it('should prioritize P-Chain over X-Chain', () => {
        const pChainNetwork = createMockNetwork(ChainId.AVALANCHE_P);
        const xChainNetwork = createMockNetwork(ChainId.AVALANCHE_X);

        const testArray = [xChainNetwork, pChainNetwork];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([pChainNetwork, xChainNetwork]);
      });
    });

    describe('when only one network is an Avalanche network', () => {
      it('should prioritize Avalanche network when first parameter is Avalanche', () => {
        const avalancheNetwork = createMockNetwork(
          ChainId.AVALANCHE_MAINNET_ID,
        );
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);

        const testArray = [ethereumNetwork, avalancheNetwork];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([avalancheNetwork, ethereumNetwork]);
      });

      it('should prioritize Avalanche network when second parameter is Avalanche', () => {
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
        const avalancheNetwork = createMockNetwork(
          ChainId.AVALANCHE_MAINNET_ID,
        );

        const testArray = [ethereumNetwork, avalancheNetwork];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([avalancheNetwork, ethereumNetwork]);
      });

      it('should prioritize P-Chain over non-Avalanche networks', () => {
        const pChainNetwork = createMockNetwork(ChainId.AVALANCHE_P);
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);

        const testArray = [ethereumNetwork, pChainNetwork];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([pChainNetwork, ethereumNetwork]);
      });

      it('should prioritize X-Chain over non-Avalanche networks', () => {
        const xChainNetwork = createMockNetwork(ChainId.AVALANCHE_X);
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);

        const testArray = [ethereumNetwork, xChainNetwork];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([xChainNetwork, ethereumNetwork]);
      });
    });

    describe('when neither network is an Avalanche network', () => {
      it('should maintain order for non-Avalanche networks', () => {
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
        const bitcoinNetwork = createMockNetwork(ChainId.BITCOIN);

        const testArray = [bitcoinNetwork, ethereumNetwork];
        testArray.sort(promoteAvalancheNetworks);

        // No preference, so original order should be maintained
        expect(testArray).toEqual([bitcoinNetwork, ethereumNetwork]);
      });
    });

    describe('when working with chain IDs directly', () => {
      it('should work with chain ID numbers instead of Network objects', () => {
        const testArray = [ChainId.AVALANCHE_P, ChainId.AVALANCHE_MAINNET_ID];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_P,
        ]);
      });

      it('should work with chain IDs when comparing different types', () => {
        const testArray = [
          ChainId.ETHEREUM_HOMESTEAD,
          ChainId.AVALANCHE_P,
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_X,
        ];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_P,
          ChainId.AVALANCHE_X,
          ChainId.ETHEREUM_HOMESTEAD,
        ]);
      });

      it('should work with testnet chain IDs', () => {
        const testArray = [
          ChainId.AVALANCHE_TEST_P,
          ChainId.AVALANCHE_TESTNET_ID,
        ];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([
          ChainId.AVALANCHE_TESTNET_ID,
          ChainId.AVALANCHE_TEST_P,
        ]);
      });
    });

    describe('comprehensive sorting scenarios', () => {
      it('should correctly sort all Avalanche network types', () => {
        const cChain = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
        const pChain = createMockNetwork(ChainId.AVALANCHE_P);
        const xChain = createMockNetwork(ChainId.AVALANCHE_X);

        // Test with mixed order
        const testArray = [xChain, pChain, cChain];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([cChain, pChain, xChain]);
      });

      it('should sort mixed Avalanche and non-Avalanche networks', () => {
        const cChain = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
        const pChain = createMockNetwork(ChainId.AVALANCHE_P);
        const xChain = createMockNetwork(ChainId.AVALANCHE_X);
        const ethereum = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
        const bitcoin = createMockNetwork(ChainId.BITCOIN);

        const testArray = [bitcoin, xChain, ethereum, pChain, cChain];
        testArray.sort(promoteAvalancheNetworks);

        // All Avalanche networks should come first, then non-Avalanche
        expect(testArray).toEqual([cChain, pChain, xChain, bitcoin, ethereum]);
      });
    });

    describe('additional edge cases', () => {
      it('should handle testnet Avalanche networks correctly', () => {
        const testnetCChain = createMockNetwork(ChainId.AVALANCHE_TESTNET_ID);
        const testnetPChain = createMockNetwork(ChainId.AVALANCHE_TEST_P);
        const testnetXChain = createMockNetwork(ChainId.AVALANCHE_TEST_X);

        const testArray = [testnetXChain, testnetCChain, testnetPChain];
        testArray.sort(promoteAvalancheNetworks);

        expect(testArray).toEqual([
          testnetCChain,
          testnetPChain,
          testnetXChain,
        ]);
      });

      it('should handle mixed mainnet and testnet Avalanche networks', () => {
        const mainnetNetwork = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
        const testnetNetwork = createMockNetwork(ChainId.AVALANCHE_TESTNET_ID);

        const testArray = [testnetNetwork, mainnetNetwork];
        testArray.sort(promoteAvalancheNetworks);

        // Both are C-Chain, so original order should be maintained
        expect(testArray).toEqual([testnetNetwork, mainnetNetwork]);
      });

      it('should handle mixed mainnet and testnet P/X chains', () => {
        const mainnetPChain = createMockNetwork(ChainId.AVALANCHE_P);
        const testnetPChain = createMockNetwork(ChainId.AVALANCHE_TEST_P);
        const mainnetXChain = createMockNetwork(ChainId.AVALANCHE_X);
        const testnetXChain = createMockNetwork(ChainId.AVALANCHE_TEST_X);

        const testArray = [
          testnetXChain,
          mainnetPChain,
          testnetPChain,
          mainnetXChain,
        ];
        testArray.sort(promoteAvalancheNetworks);

        // P-Chains should come before X-Chains regardless of mainnet/testnet
        expect(testArray).toEqual([
          mainnetPChain,
          testnetPChain,
          testnetXChain,
          mainnetXChain,
        ]);
      });

      it('should handle undefined or null-like scenarios gracefully', () => {
        // Test with zero chain IDs (non-Avalanche)
        const testArray1 = [1, 0];
        testArray1.sort(promoteAvalancheNetworks);
        expect(testArray1).toEqual([1, 0]); // No change for non-Avalanche

        // Test with negative chain IDs (non-Avalanche)
        const testArray2 = [-1, -2];
        testArray2.sort(promoteAvalancheNetworks);
        expect(testArray2).toEqual([-1, -2]); // No change for non-Avalanche
      });

      it('should work consistently with the same network compared to itself', () => {
        const network = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);

        const testArray = [network, network];
        testArray.sort(promoteAvalancheNetworks);

        // Same network should maintain order
        expect(testArray).toEqual([network, network]);
      });

      it('should handle all combinations of Avalanche chains vs non-Avalanche', () => {
        const cChain = ChainId.AVALANCHE_MAINNET_ID;
        const pChain = ChainId.AVALANCHE_P;
        const xChain = ChainId.AVALANCHE_X;
        const ethereum = ChainId.ETHEREUM_HOMESTEAD;
        const bitcoin = ChainId.BITCOIN;

        // Test comprehensive sorting with all types
        const testArray = [bitcoin, xChain, ethereum, pChain, cChain];
        testArray.sort(promoteAvalancheNetworks);

        // Expected order: C-Chain, P-Chain, X-Chain, then non-Avalanche in original order
        expect(testArray).toEqual([cChain, pChain, xChain, bitcoin, ethereum]);
      });

      it('should handle large arrays with mixed network types', () => {
        const networks = [
          ChainId.BITCOIN,
          ChainId.AVALANCHE_X,
          ChainId.ETHEREUM_HOMESTEAD,
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_TEST_P,
          ChainId.AVALANCHE_TESTNET_ID,
          ChainId.AVALANCHE_P,
          ChainId.AVALANCHE_TEST_X,
        ];

        const testArray = [...networks];
        testArray.sort(promoteAvalancheNetworks);

        // Expected order: All C-Chains, then P-Chains, then X-Chains, then non-Avalanche
        const expected = [
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_TESTNET_ID,
          ChainId.AVALANCHE_TEST_P,
          ChainId.AVALANCHE_P,
          ChainId.AVALANCHE_X,
          ChainId.AVALANCHE_TEST_X,
          ChainId.BITCOIN,
          ChainId.ETHEREUM_HOMESTEAD,
        ];

        expect(testArray).toEqual(expected);
      });
    });
  });
});
