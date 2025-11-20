import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

export const getBtcProvider = (network: NetworkWithCaipId) => {
  if (network.vmName !== NetworkVMType.BITCOIN) {
    throw new Error('Network is not a Bitcoin network');
  }

  return new BitcoinProvider(
    !network.isTestnet,
    undefined,
    `${process.env.PROXY_URL}/proxy/nownodes/${
      network.isTestnet ? 'btcbook-testnet' : 'btcbook'
    }`,
    `${process.env.PROXY_URL}/proxy/nownodes/${
      network.isTestnet ? 'btc-testnet' : 'btc'
    }`,
    process.env.GLACIER_API_KEY ? { rltoken: process.env.GLACIER_API_KEY } : {},
  );
};
