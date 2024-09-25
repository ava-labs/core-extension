import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { FetchRequest, Network as EthersNetwork } from 'ethers';

import { Network } from '@src/background/services/network/models';

import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

export const getProviderForNetwork = (
  network: Network,
  useMulticall = false
): BitcoinProvider | JsonRpcBatchInternal | Avalanche.JsonRpcProvider => {
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
      process.env.GLACIER_API_KEY ? { token: process.env.GLACIER_API_KEY } : {}
    );
  } else if (network.vmName === NetworkVMType.EVM) {
    const fetchConfig = new FetchRequest(
      addGlacierAPIKeyIfNeeded(network.rpcUrl)
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
      new EthersNetwork(network.chainName, network.chainId)
    );

    provider.pollingInterval = 2000;

    return provider;
  } else if (
    network.vmName === NetworkVMType.AVM ||
    network.vmName === NetworkVMType.PVM
  ) {
    return new Avalanche.JsonRpcProvider('https://etna.avax-dev.network', {
      addPrimaryNetworkDelegatorFee: 0n,
      addPrimaryNetworkValidatorFee: 0n,
      addSubnetDelegatorFee: 1000000n,
      addSubnetValidatorFee: 1000000n,
      avaxAssetID: '22jjRVdyTJiAEtcZciAVR8bTFyVDUVoo1T3o5PiDspQSZ2maXR',
      baseTxFee: 1000000n,
      cBlockchainID: 'vV3cui1DsEPC3nLCGH9rorwo8s6BYxM2Hz4QFE5gEYjwTqAu',
      createAssetTxFee: 1000000n,
      createBlockchainTxFee: 100000000n,
      createSubnetTxFee: 100000000n,
      hrp: 'custom',
      networkID: 76,
      pBlockchainID: '11111111111111111111111111111111LpoYY',
      transformSubnetTxFee: 100000000n,
      xBlockchainID: '2piQ2AVHCjnduiWXsSY15DtbVuwHE2cwMHYnEXHsLL73BBkdbV',
    });
  } else {
    throw new Error('unsupported network');
  }
};
