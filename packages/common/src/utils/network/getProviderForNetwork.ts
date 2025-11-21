import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
  SolanaProvider,
  getSolanaProvider,
} from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { FetchRequest, Network as EthersNetwork } from 'ethers';

import { Network } from '@core/types';

import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

export type SupportedProvider =
  | BitcoinProvider
  | JsonRpcBatchInternal
  | Avalanche.JsonRpcProvider
  | SolanaProvider;

export const getProviderForNetwork = async (
  network: Network,
  useMulticall = false,
): Promise<SupportedProvider> => {
  if (network.vmName === NetworkVMType.SVM) {
    return getSolanaProvider({
      isTestnet: Boolean(network.isTestnet),
      rpcUrl: network.isTestnet
        ? 'https://api.devnet.solana.com' // NowNodes does not support Solana Devnet
        : `${process.env.PROXY_URL}/proxy/nownodes/sol`,
    });
  }

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
      process.env.GLACIER_API_KEY
        ? { rltoken: process.env.GLACIER_API_KEY }
        : {},
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
    network.vmName === NetworkVMType.PVM ||
    network.vmName === NetworkVMType.CoreEth
  ) {
    return network.isTestnet
      ? Avalanche.JsonRpcProvider.getDefaultFujiProvider()
      : Avalanche.JsonRpcProvider.getDefaultMainnetProvider();
  } else {
    throw new Error('unsupported network');
  }
};
