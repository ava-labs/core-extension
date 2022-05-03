import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionConnectionMessage } from '@src/background/connections/models';

export function sendAvaxResetRequest(): Omit<ExtensionConnectionMessage, 'id'> {
  return {
    method: ExtensionRequest.SEND_AVAX_RESET,
    params: [],
  };
}
