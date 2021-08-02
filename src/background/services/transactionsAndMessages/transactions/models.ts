export enum TxStatus {
  // user has been shown the UI and we are waiting on approval
  PENDING = 'pending',
  // user has approved and we are waiting on the background to confirm
  SUBMITTING = 'submitting',
  // tx was submitted and returned succesfull
  SIGNED = 'signed',
  ERROR = 'error',
  ERROR_USER_CANCELED = 'error-user-canceled',
}
export interface Transaction {
  id: number | string | void;
  time: number;
  status: TxStatus;
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

export function isTxParams(params: Partial<txParams>): params is txParams {
  return !!(params.to && params.from && params.value);
}
