import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { pendingMessages$ } from '../messages';

async function getMessage(request: ExtensionConnectionMessage) {
  const params = request.params;
  if (!params) {
    return {
      ...request,
      error: 'no params on request',
    };
  }

  const messageId = params[0];

  if (!messageId) {
    return {
      ...request,
      error: 'no message id in params',
    };
  }

  const currentPendingMessages = await firstValueFrom(pendingMessages$);
  const message = currentPendingMessages[messageId];

  if (!message) {
    return { ...request, error: 'no message found with that id' };
  }

  return { ...request, result: message };
}

export const GetMessageByIdRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.MESSAGE_GET, getMessage];
