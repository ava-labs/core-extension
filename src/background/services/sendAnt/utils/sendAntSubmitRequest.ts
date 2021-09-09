import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { AssetBalanceX, BN } from '@avalabs/avalanche-wallet-sdk';

export function sendAntSubmitRequest(
  amount: BN,
  address: string,
  token: AssetBalanceX
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ANT_SUBMIT,
    params: [token, amount, address],
  };
}
