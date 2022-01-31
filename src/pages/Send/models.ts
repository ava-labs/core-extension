import { SendState } from '@avalabs/wallet-react-components';
import { GasPrice } from '@src/background/services/gas/models';

export interface SendStateWithActions extends SendState {
  txId?: string;
  setValues: (
    amount?: string,
    address?: string,
    gasPrice?: GasPrice,
    gasLimit?: number
  ) => void;
  reset: () => void;
  submit: () => Promise<string | undefined | void>;
}
