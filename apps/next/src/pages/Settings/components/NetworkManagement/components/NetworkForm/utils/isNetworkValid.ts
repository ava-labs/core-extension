import { Network } from '@avalabs/core-chains-sdk';
import { t as translate } from 'i18next';
import { NetworkFormErrors } from '../types';

const isValidURL = (text: string) => {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }
  if (
    url.protocol === 'https:' ||
    url.protocol === 'ipfs:' ||
    url.protocol === 'http:'
  ) {
    return true;
  }
};

const checkRpcUrl = (rpcUrl: string) => {
  if (!rpcUrl) {
    return translate('RPC URL is required');
  }
  if (!isValidURL(rpcUrl)) {
    return translate('RPC URL must start with http');
  }
  return undefined;
};

const checkChainName = (value: string) => {
  if (!value) {
    return translate('Chain name is required');
  }
  return undefined;
};

const checkChainId = (value: number) => {
  if (!value) {
    return translate('Chain ID is required');
  }
  return undefined;
};

const checkTokenSymbol = (value: string) => {
  if (!value) {
    return translate('Token symbol is required');
  }
  return undefined;
};

const checkTokenName = (value: string) => {
  if (!value) {
    return translate('Token name is required');
  }
  return undefined;
};

export const isNetworkValid = (network: Network) => {
  const errors: NetworkFormErrors = {
    rpcUrl: checkRpcUrl(network.rpcUrl),
    chainName: checkChainName(network.chainName),
    chainId: checkChainId(network.chainId),
    tokenSymbol: checkTokenSymbol(network.networkToken.symbol),
    tokenName: checkTokenName(network.networkToken.name),
    explorerUrl: undefined, //Optional
    logoUrl: undefined, //Optional
    rpcHeaders: undefined, //Optional
  };

  const isValid = Object.values(errors).every((error) => error === undefined);
  return { isValid, errors };
};
