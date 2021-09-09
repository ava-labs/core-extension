import { AssetBalanceX, BN } from '@avalabs/avalanche-wallet-sdk';
import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';

export function sendAntValidateRequest(
  amount: BN,
  address: string,
  token: AssetBalanceX
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ANT_VALIDATE,
    params: [amount, address, token],
  };
}
