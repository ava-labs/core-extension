import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { BN, ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

export function sendAvaxSubmitRequest(
  amount: string,
  destChain: ChainIdType,
  address: string,
  gasPrice?: BN,
  gasLimit?: number,
  memo?: string
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_AVAX_SUBMIT,
    params: [amount, destChain, address, gasPrice, gasLimit, memo],
  };
}
