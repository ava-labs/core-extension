import { TokenWithBalance } from '@src/background/services/balances/models';
import { SendState } from '@src/background/services/send/models';
import BN from 'bn.js';

export interface SendStateWithActions<
  T extends TokenWithBalance = TokenWithBalance
> extends SendState<T> {
  sendState: SendState<T>;
  resetSendState: () => void;
  submitSendState: () => Promise<string | undefined>;
  updateSendState: (args: Partial<SendState<T>>) => void;
}

export function getDefaultSendForm<T extends TokenWithBalance>(): SendState<T> {
  return {
    amount: new BN(0),
    address: '',
    canSubmit: false,
    loading: true,
  };
}
