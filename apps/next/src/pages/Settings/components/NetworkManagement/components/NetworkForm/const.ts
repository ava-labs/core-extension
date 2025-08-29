import { NetworkFormFieldInfo } from './types';

export const DEFAULT_NETWORK_FORM_FIELDS: NetworkFormFieldInfo = {
  rpcUrl: {
    required: true,
    canReset: true,
  },
  chainName: {
    required: true,
    canReset: false,
  },
  chainId: {
    required: true,
    canReset: false,
  },
  tokenSymbol: {
    required: true,
    canReset: false,
  },
  tokenName: {
    required: true,
    canReset: false,
  },
  explorerUrl: {
    required: false,
    canReset: false,
  },
  logoUrl: {
    required: false,
    canReset: false,
  },
  rpcHeaders: {
    required: false,
    canReset: false,
  },
};
