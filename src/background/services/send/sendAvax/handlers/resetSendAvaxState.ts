import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { DEFAULT_SEND_AVAX_FORM } from '@avalabs/wallet-react-components';

async function resetSendAvaxState(request: ExtensionConnectionMessage) {
  return {
    ...request,
    result: DEFAULT_SEND_AVAX_FORM,
  };
}

export const ResetSendAvaxStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_AVAX_RESET, resetSendAvaxState];
