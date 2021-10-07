import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { ERC20 } from '@avalabs/wallet-react-components';

export function sendErc20SubmitRequest(
  amount: string,
  token: ERC20,
  address: string,
  gasLimit: number
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ERC20_SUBMIT,
    params: [token, amount, address, gasLimit],
  };
}
