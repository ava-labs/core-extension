import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { EnsureDefined, PartialBy } from '@src/background/models';
import { Network } from '@src/background/services/network/models';

enum CaipNamespace {
  AVAX = 'avax',
  BIP122 = 'bip122',
  EIP155 = 'eip155',
}

const BitcoinCaipId = {
  [ChainId.BITCOIN]: `${CaipNamespace.BIP122}:000000000019d6689c085ae165831e93`,
  [ChainId.BITCOIN_TESTNET]: `${CaipNamespace.BIP122}:000000000933ea01ad0ee984209779ba`,
};
const AvaxCaipId = {
  [ChainId.AVALANCHE_P]: `${CaipNamespace.AVAX}:${Avalanche.MainnetContext.pBlockchainID}`,
  [ChainId.AVALANCHE_X]: `${CaipNamespace.AVAX}:${Avalanche.MainnetContext.xBlockchainID}`,
  [ChainId.AVALANCHE_TEST_P]: `${CaipNamespace.AVAX}:fuji${Avalanche.FujiContext.pBlockchainID}`,
  [ChainId.AVALANCHE_TEST_X]: `${CaipNamespace.AVAX}:fuji${Avalanche.FujiContext.xBlockchainID}`,
  [ChainId.AVALANCHE_DEVNET_P]: `${CaipNamespace.AVAX}:custom11111111111111111111111111111111LpoYY`,
} as const;

export const getNetworkCaipId = (network: PartialBy<Network, 'caipId'>) => {
  if (network.vmName === NetworkVMType.EVM) {
    return `eip155:${network.chainId}`;
  }

  if (network.vmName === NetworkVMType.BITCOIN) {
    return BitcoinCaipId[network.chainId];
  }

  const isXChain = network.vmName === NetworkVMType.AVM;
  const isPChain = network.vmName === NetworkVMType.PVM;

  if (isXChain || isPChain) {
    return AvaxCaipId[network.chainId];
  }

  throw new Error('Unsupported VM type: ' + network.vmName);
};

export const caipToChainId = (identifier: string): number => {
  const [namespace, reference] = identifier.split(':');

  if (!namespace) {
    throw new Error('No namespace found in identifier: ' + identifier);
  }

  if (!reference) {
    throw new Error('No reference found in identifier: ' + identifier);
  }

  if (namespace === CaipNamespace.EIP155) {
    return Number(reference);
  }

  if (namespace === CaipNamespace.BIP122) {
    const chainId = Object.keys(BitcoinCaipId).find(
      (chainIdLookup) => BitcoinCaipId[chainIdLookup] === identifier
    );

    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }

    return Number(chainId);
  }

  if (namespace === CaipNamespace.AVAX) {
    const chainId = Object.keys(AvaxCaipId).find(
      (chainIdLookup) => AvaxCaipId[chainIdLookup] === identifier
    );

    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }

    return Number(chainId);
  }

  throw new Error('No chainId match for CAIP identifier: ' + identifier);
};

export const chainIdToCaip = (chainId: number): string => {
  return BitcoinCaipId[chainId] ?? AvaxCaipId[chainId] ?? `eip155:${chainId}`;
};

export const decorateWithCaipId = (
  network: Network
): EnsureDefined<Network, 'caipId'> => ({
  ...network,
  caipId: getNetworkCaipId(network),
});
