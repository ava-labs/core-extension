export type NetworkFormTab = 'details' | 'rpc-headers';

export type NetworkFormFields =
  | 'rpcUrl'
  | 'chainName'
  | 'chainId'
  | 'tokenSymbol'
  | 'tokenName'
  | 'rpcHeaders'
  | 'explorerUrl'
  | 'logoUrl';

export type NetworkFormErrors = {
  [key in NetworkFormFields]?: string;
};
