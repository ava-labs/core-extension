import { NetworkFormFields } from './types';

export const required: { [key in NetworkFormFields]?: boolean } = {
  rpcUrl: true,
  chainId: true,
  tokenSymbol: true,
  tokenName: true,
  explorerUrl: false,
  logoUrl: false,
  rpcHeaders: false,
};
