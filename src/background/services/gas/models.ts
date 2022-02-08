import { BN } from '@avalabs/avalanche-wallet-sdk';

export interface GasPrice {
  bn: BN;
  value?: string;
}
