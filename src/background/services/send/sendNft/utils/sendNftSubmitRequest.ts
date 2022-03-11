import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { BN } from '@avalabs/avalanche-wallet-sdk';

export function sendNftSubmitRequest(
  contractAddress: string,
  tokenId: number,
  address: string,
  gasLimit: number,
  gasPrice: BN
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_NFT_SUBMIT,
    params: [contractAddress, tokenId, address, gasLimit, gasPrice],
  };
}
