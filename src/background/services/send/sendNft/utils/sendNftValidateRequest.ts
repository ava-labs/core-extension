import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { GasPrice } from '@src/background/services/networkFee/models';

export function sendNftValidateRequest(
  contractAddress?: string,
  tokenId?: number,
  address?: string,
  gasPrice?: GasPrice,
  gasLimit?: number
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_NFT_VALIDATE,
    params: [contractAddress, tokenId, address, gasPrice, gasLimit],
  };
}
