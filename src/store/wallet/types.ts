export interface ERC20 {
  name: string;
  symbol: string;
  denomination: number;
  balance: string;
  balanceParsed: string;
  address: string;
  imgUrl: string;
}

export enum TransactionSendType {
  ERC20 = 'ERC20',
  ANT = 'ANT',
  AVAX = 'AVAX',
}
