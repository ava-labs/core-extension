import { BN } from '@avalabs/avalanche-wallet-sdk';

export interface GasPrice {
  hex: string;
  bn: BN;
  value: string;
}
