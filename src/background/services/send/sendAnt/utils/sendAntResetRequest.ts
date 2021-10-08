import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';

export function sendAntResetRequest(): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_ANT_RESET,
    params: [],
  };
}
