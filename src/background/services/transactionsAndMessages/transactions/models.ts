export interface Transaction {
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

export function isTxParams(params: Partial<txParams>): params is txParams {
  return !!(params.to && params.from && params.value);
}
