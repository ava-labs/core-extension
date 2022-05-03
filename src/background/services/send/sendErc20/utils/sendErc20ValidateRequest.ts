import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { ERC20 } from '@avalabs/wallet-react-components';
import { GasPrice } from '@src/background/services/networkFee/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

export function sendErc20ValidateRequest(
  amount?: string,
  token?: ERC20,
  address?: string,
  gasPrice?: GasPrice,
  gasLimit?: number
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ERC20_VALIDATE,
    /**
     * Amount needs to be converted to nAvax so send can convert correctly
     */
    params: [token, amount, address, gasPrice, gasLimit],
  };
}
