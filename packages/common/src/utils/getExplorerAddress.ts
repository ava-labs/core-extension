import { Blockchain } from '@avalabs/core-bridge-sdk';
import { Chain } from '@avalabs/bridge-unified';
import { Network } from '@avalabs/core-chains-sdk';
import type { NetworkWithCaipId } from '@core/types';
import { networkToBlockchain } from './bridge';

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
    ? 'https://routescan.io'
    : 'https://testnet.routescan.io';
  return `${root}/tx/${txHash}`;
}

function getBTCBlockchainLink(txHash: string, isMainnet: boolean) {
  if (isMainnet) {
    return `https://www.blockchain.com/btc/tx/${txHash}`;
  }
  return `https://mempool.space/testnet4/tx/${txHash}`;
}
export function getExplorerAddress(
  chain: Blockchain | Chain,
  txHash: string,
  isMainnet: boolean,
  getNetwork: (chainId: string) => NetworkWithCaipId | undefined,
) {
  const normalizedChain =
    typeof chain === 'object' ? networkToBlockchain(chain) : chain;

  switch (normalizedChain) {
    case Blockchain.AVALANCHE:
      return getAvalancheTxLink(txHash, isMainnet);
    case Blockchain.BITCOIN:
      return getBTCBlockchainLink(txHash, isMainnet);
    case Blockchain.ETHEREUM:
      return getEtherscanLink(txHash, isMainnet);
  }

  if (typeof chain === 'string') {
    return '#';
  }

  const network = getNetwork(chain.chainId);

  return network ? getExplorerAddressByNetwork(network, txHash, 'tx') : '#';
}

export function getAvalancheAddressLink(hash: string, isMainnet = true) {
  const root = getAvalancheExplorerBaseUrl(isMainnet);

  return `${root}/address/${hash}`;
}

export function getExplorerAddressByNetwork(
  network: Network,
  hash: string,
  hashType: 'address' | 'tx' = 'tx',
) {
  try {
    // Try to respect any query params set on {network.explorerUrl}
    const baseUrl = new URL(network.explorerUrl);
    baseUrl.pathname += `/${hashType}/${hash}`;
    return baseUrl.toString();
  } catch {
    return `${network.explorerUrl}/${hashType}/${hash}`;
  }
}
