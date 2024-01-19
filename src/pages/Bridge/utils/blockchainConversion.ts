import { Blockchain, BridgeConfig } from '@avalabs/bridge-sdk';
import { Chain } from '@avalabs/bridge-unified';
import { ChainId, Network } from '@avalabs/chains-sdk';
import { caipToChainId } from '@src/utils/caipConversion';
import { t } from 'i18next';

export const blockchainToNetwork = (
  blockChain: Blockchain | Chain,
  networks: Network[],
  bridgeConfig: BridgeConfig,
  isTestnet?: boolean
) => {
  if (typeof blockChain === 'object') {
    // We got a Chain from @avalabs/bridge-unified
    const chain = networks.find(
      (network) => network.chainId === caipToChainId(blockChain.chainId)
    );

    if (!chain) {
      throw new Error(t('Blockchain not supported'));
    }

    return chain;
  }

  switch (blockChain) {
    case Blockchain.AVALANCHE:
      return networks.find(
        (network) =>
          network.chainId ===
          bridgeConfig.config?.critical.networks[Blockchain.AVALANCHE]
      );
    case Blockchain.ETHEREUM: {
      return networks.find(
        (network) =>
          network.chainId ===
          bridgeConfig.config?.critical.networks[Blockchain.ETHEREUM]
      );
    }
    case Blockchain.BITCOIN:
      return networks.find((network) => {
        if (isTestnet === undefined) {
          return (
            network.chainId === ChainId.BITCOIN_TESTNET ||
            network.chainId === ChainId.BITCOIN
          );
        }
        return isTestnet
          ? network.chainId === ChainId.BITCOIN_TESTNET
          : network.chainId === ChainId.BITCOIN;
      });
    default:
      throw new Error(t('Blockchain not supported'));
  }
};

export const networkToBlockchain = (network: Network | Chain | undefined) => {
  switch (network?.chainId) {
    case ChainId.AVALANCHE_MAINNET_ID:
    case ChainId.AVALANCHE_LOCAL_ID:
    case ChainId.AVALANCHE_TESTNET_ID:
      return Blockchain.AVALANCHE;
    case ChainId.ETHEREUM_HOMESTEAD:
    case ChainId.ETHEREUM_TEST_RINKEBY:
    case ChainId.ETHEREUM_TEST_GOERLY:
    case ChainId.ETHEREUM_TEST_SEPOLIA:
      return Blockchain.ETHEREUM;
    case ChainId.BITCOIN:
    case ChainId.BITCOIN_TESTNET:
      return Blockchain.BITCOIN;
    default:
      return Blockchain.UNKNOWN;
  }
};
