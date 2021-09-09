import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { ERC20 } from '@avalabs/wallet-react-components';

export function sendErc20ValidateRequest(
  amount: BN,
  token: ERC20,
  address: string
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ERC20_VALIDATE,
    params: [token, amount, address],
  };
}
