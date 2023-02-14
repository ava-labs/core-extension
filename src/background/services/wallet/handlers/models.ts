import { TokenWithBalance } from '@src/background/services/balances/models';
import { ValidSendState } from '@src/background/services/send/models';

export interface DisplayData_BitcoinSendTx {
  sendState: ValidSendState;
  balance?: TokenWithBalance;
}
