export interface UnapprovedTransaction {
  id: number | string | void;
  time: number;
  status: string;
  metamaskNetworkId: string;
  chainId: string;
  txParams: txParams;
  type: string;
  transactionCategory: string;
  txHash?: string;
}

export interface txParams {
  from: string;
  to: string;
  value: string;
  data?: string;
  gas?: string;
  gasPrice?: string;
}

export type MessageType =
  | 'eth_decrypt'
  | 'eth_signTypedData'
  | 'eth_getEncryptionPublicKey'
  | 'metamask_getProviderState'
  | 'personal_sign'
  | 'wallet_watchAsset'
  | 'metamask_watchAsset';

export interface UnapprovedMessage {
  id: number | string | void;
  from: string;
  msgParams: any;
  time: number;
  status: string;
  type: MessageType;
}
