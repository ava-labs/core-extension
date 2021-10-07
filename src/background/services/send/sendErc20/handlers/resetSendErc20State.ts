import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { SEND_ERC20_FORM_DEFAULT } from '@avalabs/wallet-react-components';

async function resetSendErc20State(request: ExtensionConnectionMessage) {
  const [token] = request.params || [];

  if (!token) {
    return {
      ...request,
      error: 'no token in params',
    };
  }

  return {
    ...request,
    result: {
      ...SEND_ERC20_FORM_DEFAULT,
      token,
    },
  };
}

export const ResetSendErc20StateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ERC20_RESET, resetSendErc20State];
