import { SendState } from '@avalabs/wallet-react-components';

export enum TransactionSendType {
  ERC20 = 'ERC20',
  ANT = 'ANT',
  AVAX = 'AVAX',
}

export interface SendStateWithActions extends SendState {
  txId?: string;
  setValues: (amount?: string, address?: string) => void;
  reset: () => void;
  submit: () => Promise<string | undefined | void>;
}
