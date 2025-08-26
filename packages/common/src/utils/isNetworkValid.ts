import { Network } from '@avalabs/core-chains-sdk';
import { i18n } from 'webextension-polyfill';

export const isNetworkValid = (network: Network) => {
  if (!network.rpcUrl) {
    return { valid: false, reason: i18n.getMessage('RPC URL is required') };
  }

  if (!network.chainName) {
    return { valid: false, reason: i18n.getMessage('Chain name is required') };
  }
  if (!network.chainId) {
    return { valid: false, reason: i18n.getMessage('Chain ID is required') };
  }

  if (!network.networkToken.symbol) {
    return {
      valid: false,
      reason: i18n.getMessage('Token symbol is required'),
    };
  }

  if (!network.networkToken.name) {
    return { valid: false, reason: i18n.getMessage('Token name is required') };
  }
  return { valid: true, reason: '' };
};
