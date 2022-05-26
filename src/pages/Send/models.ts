import { SendState } from '@avalabs/wallet-react-components';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { BigNumber } from 'ethers';

export type SetSendValuesParams = {
  token?: TokenWithBalance;
  amount?: string;
  address?: string;
  gasPrice?: BigNumber;
  gasLimit?: number;
};

export type SetSendNftValuesParams = {
  address?: string;
  gasPrice?: BigNumber;
  gasLimit?: number;
};

export interface SendStateWithActions extends SendState {
  txId?: string;
  setValues: (args: SetSendValuesParams) => void;
  reset: () => void;
  submit: () => Promise<string | undefined | void>;
}
