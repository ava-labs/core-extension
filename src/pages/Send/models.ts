import { SendableToken } from '@src/background/services/balances/models';
import { SendState } from '@src/background/services/send/models';
import BN from 'bn.js';

export interface SendStateWithActions<T extends SendableToken = SendableToken>
  extends SendState<T> {
  sendState: SendState<T>;
  resetSendState: () => void;
  submitSendState: () => Promise<string | undefined>;
  updateSendState: (args: Partial<SendState<T>>) => void;
}

export function getDefaultSendForm<T extends SendableToken>(): SendState<T> {
  return {
    amount: new BN(0),
    address: '',
    canSubmit: false,
    loading: true,
  };
}
