import { SendState, TokenWithBalance } from '@avalabs/wallet-react-components';
import { GasPrice } from '@src/background/services/gas/models';

export type SetSendValuesParams = {
  token?: TokenWithBalance;
  amount?: string;
  address?: string;
  gasPrice?: GasPrice;
  gasLimit?: number;
};

export type SetSendNftValuesParams = {
  address?: string;
  gasPrice?: GasPrice;
  gasLimit?: number;
};

export interface SendStateWithActions extends SendState {
  txId?: string;
  setValues: (args: SetSendValuesParams) => void;
  reset: () => void;
  submit: () => Promise<string | undefined | void>;
}
