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

export type FieldInfo = {
  required: boolean;
  canReset: boolean;
  error?: string;
  resetAction?: () => void;
};

export type NetworkFormFieldInfo = { [key in NetworkFormFields]: FieldInfo };

export type AddNetworkFormView = 'details' | 'rpc-headers';
export type EditNetworkFormView =
  | AddNetworkFormView
  | 'rpc-url-reset'
  | 'save'
  | 'delete';
