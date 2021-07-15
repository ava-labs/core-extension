import { ERC20Balance } from '../../../../avalanche-wallet-sdk-internal/dist/Wallet/types';

export type ERC20 = {
  logoURI?: string;
} & ERC20Balance;

export enum TransactionSendType {
  ERC20 = 'ERC20',
  ANT = 'ANT',
  AVAX = 'AVAX',
}
