import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { ChainList, Network } from '@core/types';
import type { NetworkListV2Response } from '~/api-clients/token-aggregator';

type ApiNetworks = NetworkListV2Response['data'];
type ApiNetwork = ApiNetworks[string];

const isKnownVmType = (vmName: string): vmName is NetworkVMType =>
  (Object.values(NetworkVMType) as string[]).includes(vmName);

const toNetwork = (api: ApiNetwork): Network | undefined => {
  // A network without an RPC URL or native token can't be used here. The
  // Avalanche X/P-Chains (which come back with a null rpcUrl) are injected
  // from local config instead, so skipping them is expected. An unrecognized
  // vmName is a free-form string from the API that would slip past typing and
  // break VM-specific logic downstream, so skip those too.
  if (!api.rpcUrl || !api.networkToken || !isKnownVmType(api.vmName)) {
    return undefined;
  }

  return {
    chainId: api.chainId,
    chainName: api.chainName,
    caip2Id: api.caip2Id,
    vmName: api.vmName,
    rpcUrl: api.rpcUrl,
    wsUrl: api.wsUrl ?? undefined,
    isTestnet: api.isTestnet,
    explorerUrl: api.explorerUrl,
    subnetExplorerUriId: api.subnetExplorerUriId,
    logoUri: api.logoUri ?? '',
    primaryColor: api.primaryColor ?? undefined,
    description: api.description ?? undefined,
    platformChainId: api.platformChainId ?? undefined,
    subnetId: api.subnetId ?? undefined,
    vmId: api.vmId ?? undefined,
    networkToken: {
      name: api.networkToken.name,
      symbol: api.networkToken.symbol,
      decimals: api.networkToken.decimals,
      description: api.networkToken.description ?? '',
      logoUri: api.networkToken.logoUri ?? '',
    },
    utilityAddresses:
      api.utilityAddresses && typeof api.utilityAddresses.multicall === 'string'
        ? { multicall: api.utilityAddresses.multicall }
        : undefined,
    pricingProviders: api.pricingProviders
      ? {
          coingecko: {
            assetPlatformId: api.pricingProviders.coingecko.assetPlatformId,
            nativeTokenId:
              api.pricingProviders.coingecko.nativeTokenId ?? undefined,
          },
        }
      : undefined,
    isAlwaysEnabled: api.isAlwaysEnabled,
    isEnabledByDefault: api.isEnabledByDefault,
  };
};

// Re-keys the CAIP-2-keyed `/v2/networks` response into the numeric-chainId
// `ChainList` the rest of the extension expects, dropping entries that can't
// form a usable network.
export const mapV2NetworksToChainList = (data: ApiNetworks): ChainList => {
  const chainList: ChainList = {};

  for (const api of Object.values(data)) {
    const network = toNetwork(api);
    if (network) {
      chainList[network.chainId] = network;
    }
  }

  return chainList;
};
