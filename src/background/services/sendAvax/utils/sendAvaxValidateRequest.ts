import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';

export function sendAvaxValidateRequest(
  amount?: string,
  address?: string
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_AVAX_VALIDATE,
    /**
     * Need to convert amount to nAvax form number string
     */
    params: [amount, address],
  };
}
