import { Blockchain } from '@avalabs/bridge-sdk';
import { ChainId, Network } from '@avalabs/chains-sdk';

function getAvalancheTxLink(hash: string, isMainnet = true) {
  const root = isMainnet
    ? 'https://snowtrace.io'
    : 'https://testnet.snowtrace.io';
  return `${root}/tx/${hash}`;
}

function getEtherscanLink(txHash: string, isMainnet: boolean) {
  const root = isMainnet
    ? 'https://etherscan.io'
    : 'https://rinkeby.etherscan.io';
  return `${root}/tx/${txHash}`;
}

function getBTCBlockchainLink(txHash: string, isMainnet: boolean) {
  const env = isMainnet ? 'btc' : 'btc-testnet';
  return `https://www.blockchain.com/${env}/tx/${txHash}`;
}
export function getExplorerAddress(
  chain: Blockchain,
  txHash: string,
  isMainnet: boolean
) {
  switch (chain) {
    case Blockchain.AVALANCHE:
      return getAvalancheTxLink(txHash, isMainnet);
    case Blockchain.BITCOIN:
      return getBTCBlockchainLink(txHash, isMainnet);
    default:
      return getEtherscanLink(txHash, isMainnet);
  }
}

export function getExplorerAddressByNetwork(
  network: Network,
  txHash: string,
  isMainnet: boolean
) {
  const { chainId } = network;

  switch (chainId) {
    case ChainId.AVALANCHE_MAINNET_ID:
    case ChainId.AVALANCHE_TESTNET_ID:
    case ChainId.AVALANCHE_LOCAL_ID:
      return getExplorerAddress(Blockchain.AVALANCHE, txHash, isMainnet);
    case ChainId.BITCOIN:
    case ChainId.BITCOIN_TESTNET:
      return getExplorerAddress(Blockchain.BITCOIN, txHash, isMainnet);
    default:
      return getExplorerAddress(Blockchain.ETHEREUM, txHash, isMainnet);
  }
}
