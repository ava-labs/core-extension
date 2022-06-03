import { SendState } from '@src/background/services/send/models';
import BN from 'bn.js';

export interface SendStateWithActions extends SendState {
  sendState: SendState;
  resetSendState: () => void;
  submitSendState: () => Promise<string | undefined | void>;
  updateSendState: (args: Partial<SendState>) => void;
}

export const DEFAULT_SEND_FORM: SendState = {
  amount: new BN(0),
  address: '',
  canSubmit: false,
  loading: true,
};
