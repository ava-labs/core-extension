import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { BigNumber } from 'ethers';

export function sendAvaxValidateRequest(
  amount?: string,
  address?: string,
  gasPrice?: BigNumber,
  gasLimit?: number
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_AVAX_VALIDATE,
    /**
     * Need to convert amount to nAvax form number string
     */
    params: [amount, address, gasPrice, gasLimit],
  };
}
