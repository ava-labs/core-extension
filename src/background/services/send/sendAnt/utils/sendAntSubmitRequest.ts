import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { AntWithBalance } from '@avalabs/wallet-react-components';

export function sendAntSubmitRequest(
  amount: string,
  address: string,
  token: AntWithBalance
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ANT_SUBMIT,
    params: [token, amount, address],
  };
}
