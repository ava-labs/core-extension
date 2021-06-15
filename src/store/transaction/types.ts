export interface UnapprovedTransaction {
  id: number;
  time: number;
  status: string;
  metamaskNetworkId: string;
  chainId: string;
  txParams: txParams;
  type: string;
  transactionCategory: string;
}

export interface txParams {
  from: string;
  to: string;
  value: string;
  data?: string;
  gas: string;
  gasPrice: string;
}
