import { Blockchain, BridgeConfig } from '@avalabs/bridge-sdk';
import { ChainId, Network } from '@avalabs/chains-sdk';
import { t } from 'i18next';

export const blockchainToNetwork = (
  blockChain: Blockchain,
  networks: Network[],
  bridgeConfig: BridgeConfig
) => {
  switch (blockChain) {
    case Blockchain.AVALANCHE:
      return networks.find(
        (network) =>
          network.chainId ===
          bridgeConfig.config?.critical.networks[Blockchain.AVALANCHE]
      );
    case Blockchain.ETHEREUM:
      return networks.find(
        (network) =>
          network.chainId ===
          bridgeConfig.config?.critical.networks[Blockchain.ETHEREUM]
      );
    case Blockchain.BITCOIN:
      return networks.find(
        (network) =>
          network.chainId === ChainId.BITCOIN ||
          network.chainId === ChainId.BITCOIN_TESTNET
      );
    default:
      throw new Error(t('Blockchain not supported'));
  }
};

export const networkToBlockchain = (network: Network | undefined) => {
  switch (network?.chainId) {
    case ChainId.AVALANCHE_MAINNET_ID:
    case ChainId.AVALANCHE_LOCAL_ID:
    case ChainId.AVALANCHE_TESTNET_ID:
      return Blockchain.AVALANCHE;
    case ChainId.ETHEREUM_HOMESTEAD:
    case ChainId.ETHEREUM_TEST_RINKEBY:
    case ChainId.ETHEREUM_TEST_GOERLY:
      return Blockchain.ETHEREUM;
    case ChainId.BITCOIN:
    case ChainId.BITCOIN_TESTNET:
      return Blockchain.BITCOIN;
    default:
      return Blockchain.UNKNOWN;
  }
};
