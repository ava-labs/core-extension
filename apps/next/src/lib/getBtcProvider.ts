import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { getCachedCoreApiKey } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

export const getBtcProvider = (network: NetworkWithCaipId) => {
  if (network.vmName !== NetworkVMType.BITCOIN) {
    throw new Error('Network is not a Bitcoin network');
  }

  const glacierApiKey = getCachedCoreApiKey('glacier');

  return new BitcoinProvider(
    !network.isTestnet,
    undefined,
    `${process.env.PROXY_URL}/proxy/nownodes/${
      network.isTestnet ? 'btcbook-testnet' : 'btcbook'
    }`,
    `${process.env.PROXY_URL}/proxy/nownodes/${
      network.isTestnet ? 'btc-testnet' : 'btc'
    }`,
    glacierApiKey ? { rltoken: glacierApiKey } : {},
  );
};
