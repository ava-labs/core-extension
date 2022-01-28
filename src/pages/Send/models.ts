import { SendState } from '@avalabs/wallet-react-components';

export interface SendStateWithActions extends SendState {
  txId?: string;
  setValues: (amount?: string, address?: string) => void;
  reset: () => void;
  submit: () => Promise<string | undefined | void>;
}
