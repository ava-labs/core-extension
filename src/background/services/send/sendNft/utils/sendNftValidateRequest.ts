import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { BigNumber } from 'ethers';

export function sendNftValidateRequest(
  contractAddress?: string,
  tokenId?: number,
  address?: string,
  gasPrice?: BigNumber,
  gasLimit?: number
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_NFT_VALIDATE,
    params: [contractAddress, tokenId, address, gasPrice, gasLimit],
  };
}
