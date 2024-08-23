import { Blockchain } from '@avalabs/core-bridge-sdk';
import { Chain } from '@avalabs/bridge-unified';
import { Network } from '@avalabs/core-chains-sdk';
import { networkToBlockchain } from '@src/pages/Bridge/utils/blockchainConversion';

function getAvalancheExplorerBaseUrl(isMainnet = true) {
  return isMainnet
    ? 'https://subnets.avax.network/c-chain'
    : 'https://subnets-test.avax.network/c-chain';
}

function getAvalancheTxLink(hash: string, isMainnet = true) {
  const root = getAvalancheExplorerBaseUrl(isMainnet);
  return `${root}/tx/${hash}`;
}

function getEtherscanLink(txHash: string, isMainnet: boolean) {
  const root = isMainnet
    ? 'https://etherscan.io'
    : 'https://sepolia.etherscan.io';
  return `${root}/tx/${txHash}`;
}

function getBTCBlockchainLink(txHash: string, isMainnet: boolean) {
  const env = isMainnet ? 'btc' : 'btc-testnet';
  return `https://www.blockchain.com/${env}/tx/${txHash}`;
}
export function getExplorerAddress(
  chain: Blockchain | Chain,
  txHash: string,
  isMainnet: boolean
) {
  const normalizedChain =
    typeof chain === 'object' ? networkToBlockchain(chain) : chain;

  switch (normalizedChain) {
    case Blockchain.AVALANCHE:
      return getAvalancheTxLink(txHash, isMainnet);
    case Blockchain.BITCOIN:
      return getBTCBlockchainLink(txHash, isMainnet);
    default:
      return getEtherscanLink(txHash, isMainnet);
  }
}

export function getAvalancheAddressLink(hash: string, isMainnet = true) {
  const root = getAvalancheExplorerBaseUrl(isMainnet);

  return `${root}/address/${hash}`;
}

export function getExplorerAddressByNetwork(
  network: Network,
  hash: string,
  hashType: 'address' | 'tx' = 'tx'
) {
  return `${network.explorerUrl}/${hashType}/${hash}`;
}