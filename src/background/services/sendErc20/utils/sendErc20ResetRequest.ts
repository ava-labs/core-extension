import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { ERC20 } from '@avalabs/wallet-react-components';

export function sendErc20ResetRequest(
  token: ERC20
): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ERC20_RESET,
    params: [],
  };
}
