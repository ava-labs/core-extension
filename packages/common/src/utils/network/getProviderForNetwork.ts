import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
  SolanaProvider,
  getSolanaProvider,
} from '@avalabs/core-wallets-sdk';
import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { FetchRequest, Network as EthersNetwork } from 'ethers';

import { Network } from '@core/types';

import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

export type SupportedProvider =
  | BitcoinProvider
  | JsonRpcBatchInternal
  | Avalanche.JsonRpcProvider
  | SolanaProvider;

/**
 * There are three Solana clusters, so a single `isTestnet` flag cannot pick the
 * right RPC: it routed both Devnet *and* Testnet to the Devnet endpoint. Solana
 * messages carry no chain id - the recent blockhash is the only thing binding a
 * transaction to a cluster - so talking to the wrong cluster means simulations,
 * broadcasts, and blockhash validation all silently answer for a chain the user
 * did not ask for. Route on the chain id instead.
 */
const getSolanaRpcUrl = (network: Network): string => {
  switch (network.chainId) {
    case ChainId.SOLANA_DEVNET_ID:
      return 'https://api.devnet.solana.com'; // NowNodes does not support Solana Devnet
    case ChainId.SOLANA_TESTNET_ID:
      return 'https://api.testnet.solana.com';
    default:
      return `${process.env.PROXY_URL}/proxy/nownodes/sol`;
  }
};

export const getProviderForNetwork = async (
  network: Network,
  useMulticall = false,
): Promise<SupportedProvider> => {
  if (network.vmName === NetworkVMType.SVM) {
    return getSolanaProvider({
      isTestnet: Boolean(network.isTestnet),
      rpcUrl: getSolanaRpcUrl(network),
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
    if (network.isDevnet) {
      return Avalanche.JsonRpcProvider.fromBaseURL(network.rpcUrl);
    }

    return network.isTestnet
      ? Avalanche.JsonRpcProvider.getDefaultFujiProvider()
      : Avalanche.JsonRpcProvider.getDefaultMainnetProvider();
  } else {
    throw new Error('unsupported network');
  }
};
