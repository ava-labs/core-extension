import { ChainId } from '@avalabs/core-chains-sdk';
import { Network } from '@core/types';
import { promoteNetworks } from './networkSortingFn';

describe('contexts/NetworkProvider/networkSortingFn', () => {
  describe('promoteNetworks', () => {
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
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([cChainNetwork, pChainNetwork]);
      });

      it('should prioritize C-Chain over X-Chain', () => {
        const cChainNetwork = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
        const xChainNetwork = createMockNetwork(ChainId.AVALANCHE_X);

        const testArray = [xChainNetwork, cChainNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([cChainNetwork, xChainNetwork]);
      });

      it('should prioritize P-Chain over X-Chain', () => {
        const pChainNetwork = createMockNetwork(ChainId.AVALANCHE_P);
        const xChainNetwork = createMockNetwork(ChainId.AVALANCHE_X);

        const testArray = [xChainNetwork, pChainNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([pChainNetwork, xChainNetwork]);
      });
    });

    describe('when comparing Avalanche networks with Bitcoin and Ethereum', () => {
      it('should prioritize Avalanche C-Chain over Bitcoin', () => {
        const avalancheNetwork = createMockNetwork(
          ChainId.AVALANCHE_MAINNET_ID,
        );
        const bitcoinNetwork = createMockNetwork(ChainId.BITCOIN);

        const testArray = [bitcoinNetwork, avalancheNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([avalancheNetwork, bitcoinNetwork]);
      });

      it('should prioritize Avalanche C-Chain over Ethereum', () => {
        const avalancheNetwork = createMockNetwork(
          ChainId.AVALANCHE_MAINNET_ID,
        );
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);

        const testArray = [ethereumNetwork, avalancheNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([avalancheNetwork, ethereumNetwork]);
      });

      it('should prioritize P-Chain over Bitcoin', () => {
        const pChainNetwork = createMockNetwork(ChainId.AVALANCHE_P);
        const bitcoinNetwork = createMockNetwork(ChainId.BITCOIN);

        const testArray = [bitcoinNetwork, pChainNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([pChainNetwork, bitcoinNetwork]);
      });

      it('should prioritize X-Chain over Bitcoin', () => {
        const xChainNetwork = createMockNetwork(ChainId.AVALANCHE_X);
        const bitcoinNetwork = createMockNetwork(ChainId.BITCOIN);

        const testArray = [bitcoinNetwork, xChainNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([xChainNetwork, bitcoinNetwork]);
      });

      it('should prioritize Bitcoin over Ethereum', () => {
        const bitcoinNetwork = createMockNetwork(ChainId.BITCOIN);
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);

        const testArray = [ethereumNetwork, bitcoinNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([bitcoinNetwork, ethereumNetwork]);
      });
    });

    describe('when comparing promoted networks with non-promoted networks', () => {
      it('should prioritize Avalanche network over other networks', () => {
        const avalancheNetwork = createMockNetwork(
          ChainId.AVALANCHE_MAINNET_ID,
        );
        const otherNetwork = createMockNetwork(12345);

        const testArray = [otherNetwork, avalancheNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([avalancheNetwork, otherNetwork]);
      });

      it('should prioritize Bitcoin over non-promoted networks', () => {
        const bitcoinNetwork = createMockNetwork(ChainId.BITCOIN);
        const otherNetwork = createMockNetwork(12345);

        const testArray = [otherNetwork, bitcoinNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([bitcoinNetwork, otherNetwork]);
      });

      it('should prioritize Ethereum over non-promoted networks', () => {
        const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
        const otherNetwork = createMockNetwork(12345);

        const testArray = [otherNetwork, ethereumNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([ethereumNetwork, otherNetwork]);
      });

      it('should prioritize P-Chain over non-promoted networks', () => {
        const pChainNetwork = createMockNetwork(ChainId.AVALANCHE_P);
        const otherNetwork = createMockNetwork(12345);

        const testArray = [otherNetwork, pChainNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([pChainNetwork, otherNetwork]);
      });

      it('should prioritize X-Chain over non-promoted networks', () => {
        const xChainNetwork = createMockNetwork(ChainId.AVALANCHE_X);
        const otherNetwork = createMockNetwork(12345);

        const testArray = [otherNetwork, xChainNetwork];
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([xChainNetwork, otherNetwork]);
      });
    });

    describe('when neither network is promoted', () => {
      it('should maintain order for non-promoted networks', () => {
        const network1 = createMockNetwork(12345);
        const network2 = createMockNetwork(67890);

        const testArray = [network1, network2];
        testArray.sort(promoteNetworks);

        // No preference, so original order should be maintained
        expect(testArray).toEqual([network1, network2]);
      });
    });

    describe('when working with chain IDs directly', () => {
      it('should work with chain ID numbers instead of Network objects', () => {
        const testArray = [ChainId.AVALANCHE_P, ChainId.AVALANCHE_MAINNET_ID];
        testArray.sort(promoteNetworks);

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
        testArray.sort(promoteNetworks);

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
        testArray.sort(promoteNetworks);

        expect(testArray).toEqual([
          ChainId.AVALANCHE_TESTNET_ID,
          ChainId.AVALANCHE_TEST_P,
        ]);
      });
    });

    it('should correctly sort all Avalanche network types', () => {
      const cChain = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
      const pChain = createMockNetwork(ChainId.AVALANCHE_P);
      const xChain = createMockNetwork(ChainId.AVALANCHE_X);

      // Test with mixed order
      const testArray = [xChain, pChain, cChain];
      testArray.sort(promoteNetworks);

      expect(testArray).toEqual([cChain, pChain, xChain]);
    });

    it('should sort all promoted networks in correct order', () => {
      const cChain = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
      const pChain = createMockNetwork(ChainId.AVALANCHE_P);
      const xChain = createMockNetwork(ChainId.AVALANCHE_X);
      const ethereum = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
      const bitcoin = createMockNetwork(ChainId.BITCOIN);
      const other = createMockNetwork(12345);

      const testArray = [other, ethereum, bitcoin, xChain, pChain, cChain];
      testArray.sort(promoteNetworks);

      // Order: C-Chain, P-Chain, X-Chain, Bitcoin, Ethereum, then non-promoted
      expect(testArray).toEqual([
        cChain,
        pChain,
        xChain,
        bitcoin,
        ethereum,
        other,
      ]);
    });
  });
});
