import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { BN } from '@avalabs/avalanche-wallet-sdk';

export function sendAvaxValidateRequest(
  amount: BN,
  address: string
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_AVAX_VALIDATE,
    params: [amount, address],
  };
}
