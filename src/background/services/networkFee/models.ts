import { BN } from '@avalabs/avalanche-wallet-sdk';

export interface GasPrice {
  bn: BN;
  value?: string;
}

export enum NetworkFeeEvents {
  NETWORK_FEE_UPDATED = 'network-fee-updated',
}
