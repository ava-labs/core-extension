import { ERC20Balance } from '@avalabs/avalanche-wallet-sdk';

export type ERC20 = {
  logoURI?: string;
} & ERC20Balance;

export enum TransactionSendType {
  ERC20 = 'ERC20',
  ANT = 'ANT',
  AVAX = 'AVAX',
}
