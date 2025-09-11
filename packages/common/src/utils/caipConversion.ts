import {
  AvalancheCaip2ChainId,
  BitcoinCaip2ChainId,
  ChainId,
} from '@avalabs/core-chains-sdk';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { EnsureDefined, PartialBy, Network } from '@core/types';

export enum CaipNamespace {
  AVAX = 'avax',
  BIP122 = 'bip122',
  EIP155 = 'eip155',
  HVM = 'hvm',
  SOLANA = 'solana',
}

export const BitcoinCaipId = {
  [ChainId.BITCOIN]: BitcoinCaip2ChainId.MAINNET,
  [ChainId.BITCOIN_TESTNET]: BitcoinCaip2ChainId.TESTNET,
};

export const SolanaCaipId = {
  [ChainId.SOLANA_MAINNET_ID]: `${CaipNamespace.SOLANA}:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`,
  [ChainId.SOLANA_DEVNET_ID]: `${CaipNamespace.SOLANA}:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`,
  [ChainId.SOLANA_TESTNET_ID]: `${CaipNamespace.SOLANA}:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z`,
};

export const AvaxLegacyCaipId = {
  [ChainId.AVALANCHE_P]: `${CaipNamespace.AVAX}:${Avalanche.MainnetContext.pBlockchainID}`,
  [ChainId.AVALANCHE_X]: `${CaipNamespace.AVAX}:${Avalanche.MainnetContext.xBlockchainID}`,
  [ChainId.AVALANCHE_TEST_P]: `${CaipNamespace.AVAX}:fuji${Avalanche.FujiContext.pBlockchainID}`,
  [ChainId.AVALANCHE_TEST_X]: `${CaipNamespace.AVAX}:fuji${Avalanche.FujiContext.xBlockchainID}`,
};

export const AvaxCaipId = {
  [ChainId.AVALANCHE_P]: AvalancheCaip2ChainId.P,
  [ChainId.AVALANCHE_X]: AvalancheCaip2ChainId.X,
  [ChainId.AVALANCHE_TEST_P]: AvalancheCaip2ChainId.P_TESTNET,
  [ChainId.AVALANCHE_TEST_X]: AvalancheCaip2ChainId.X_TESTNET,
} as const;

export const getNetworkCaipId = (network: PartialBy<Network, 'caipId'>) => {
  if (network.caipId) {
    return network.caipId;
  } else if (network.caip2Id) {
    return network.caip2Id;
  }
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

  if (network.vmName === NetworkVMType.HVM) {
    return `hvm:${network.chainId}`;
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

  if (reference.length === 32 && namespace === CaipNamespace.HVM) {
    return parseInt(reference.slice(0, 16), 16);
  }
  if (namespace === CaipNamespace.SOLANA) {
    const chainId = Object.keys(SolanaCaipId).find(
      (chainIdLookup) => SolanaCaipId[chainIdLookup] === identifier,
    );

    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }

    return Number(chainId);
  }
  if (namespace === CaipNamespace.BIP122) {
    const chainId = Object.keys(BitcoinCaipId).find(
      (chainIdLookup) => BitcoinCaipId[chainIdLookup] === identifier,
    );

    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }

    return Number(chainId);
  }

  if (namespace === CaipNamespace.AVAX) {
    const chainId = Object.keys(AvaxCaipId).find(
      (chainIdLookup) =>
        AvaxCaipId[chainIdLookup] === identifier ||
        AvaxLegacyCaipId[chainIdLookup] === identifier,
    );

    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }

    return Number(chainId);
  }

  throw new Error('No chainId match for CAIP identifier: ' + identifier);
};

export const chainIdToCaip = (chainId: number): string => {
  return (
    BitcoinCaipId[chainId] ??
    AvaxCaipId[chainId] ??
    SolanaCaipId[chainId] ??
    `eip155:${chainId}`
  );
};

export const decorateWithCaipId = (
  network: Network,
): EnsureDefined<Network, 'caipId'> => ({
  ...network,
  caipId: getNetworkCaipId(network),
});

export const getNameSpaceFromScope = (scope?: string | null) => {
  if (!scope) {
    return null;
  }
  const [namespace] = scope.split(':');
  return namespace;
};
export const isBitcoinCaipId = (caipId: string) =>
  (Object.values(BitcoinCaipId) as string[]).includes(caipId);
