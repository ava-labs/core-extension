import { BN } from '@avalabs/avalanche-wallet-sdk';
import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { AntWithBalance } from '@src/hooks/useTokensWithBalances';

export function sendAntValidateRequest(
  amount: BN,
  address: string,
  token: AntWithBalance
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ANT_VALIDATE,
    params: [amount, address, token],
  };
}
