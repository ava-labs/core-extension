import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { SEND_ANT_FORM_DEFAULT } from '@avalabs/wallet-react-components';

async function resetSendAntState(request: ExtensionConnectionMessage) {
  const params = request.params || [];
  const [token] = params;

  if (!token) {
    return {
      ...request,
      error: 'no token in params',
    };
  }

  return {
    ...request,
    result: {
      ...SEND_ANT_FORM_DEFAULT,
      token,
    },
  };
}

export const ResetSendAntStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ANT_RESET, resetSendAntState];
