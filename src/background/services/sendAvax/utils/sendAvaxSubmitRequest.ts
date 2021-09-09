import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { BN, ChainIdType } from '@avalabs/avalanche-wallet-sdk';

export function sendAvaxSubmitRequest(
  amount: BN,
  destChain: ChainIdType,
  address: string
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_AVAX_SUBMIT,
    params: [amount, destChain, address],
  };
}
