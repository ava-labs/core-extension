import { Network } from '@avalabs/core-chains-sdk';

function getAvalancheExplorerBaseUrl(isMainnet = true) {
  return isMainnet
    ? 'https://subnets.avax.network/c-chain'
    : 'https://subnets-test.avax.network/c-chain';
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
