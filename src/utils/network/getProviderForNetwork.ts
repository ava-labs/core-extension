import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { FetchRequest, Network as EthersNetwork } from 'ethers';
import { info } from '@avalabs/avalanchejs';

import type { Network } from '@src/background/services/network/models';

import { isDevnet } from '../isDevnet';
import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

export type SupportedProvider =
  | BitcoinProvider
  | JsonRpcBatchInternal
  | Avalanche.JsonRpcProvider;

export const getProviderForNetwork = async (
  network: Network,
  useMulticall = false,
): Promise<SupportedProvider> => {
  if (network.vmName === NetworkVMType.BITCOIN) {
    return new BitcoinProvider(
      !network.isTestnet,
      undefined,
      `${process.env.PROXY_URL}/proxy/nownodes/${
        network.isTestnet ? 'btcbook-testnet' : 'btcbook'
      }`,
      `${process.env.PROXY_URL}/proxy/nownodes/${
        network.isTestnet ? 'btc-testnet' : 'btc'
      }`,
      process.env.GLACIER_API_KEY ? { token: process.env.GLACIER_API_KEY } : {},
    );
  } else if (network.vmName === NetworkVMType.EVM) {
    const fetchConfig = new FetchRequest(
      addGlacierAPIKeyIfNeeded(network.rpcUrl),
    );

    if (network.customRpcHeaders) {
      const headers = Object.entries(network.customRpcHeaders);

      for (const [name, value] of headers) {
        fetchConfig.setHeader(name, value);
      }
    }

    const provider = new JsonRpcBatchInternal(
      useMulticall
        ? {
            maxCalls: 40,
            multiContractAddress: network.utilityAddresses?.multicall,
          }
        : 40,
      fetchConfig,
      new EthersNetwork(network.chainName, network.chainId),
    );

    provider.pollingInterval = 2000;

    return provider;
  } else if (
    network.vmName === NetworkVMType.AVM ||
    network.vmName === NetworkVMType.PVM
  ) {
    const upgradesInfo = await new info.InfoApi(network.rpcUrl)
      .getUpgradesInfo()
      .catch(() => undefined);

    return isDevnet(network)
      ? Avalanche.JsonRpcProvider.getDefaultDevnetProvider(upgradesInfo)
      : network.isTestnet
        ? Avalanche.JsonRpcProvider.getDefaultFujiProvider(upgradesInfo)
        : Avalanche.JsonRpcProvider.getDefaultMainnetProvider(upgradesInfo);
  } else {
    throw new Error('unsupported network');
  }
};
