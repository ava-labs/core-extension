/**
 * Custom network data structure for adding/editing networks
 */
export interface CustomNetworkData {
  name: string;
  rpcUrl: string;
  chainId: string;
  tokenSymbol: string;
  tokenName: string;
  explorerUrl?: string;
}
