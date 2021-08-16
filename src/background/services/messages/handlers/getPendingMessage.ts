import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom, map } from 'rxjs';
import { pendingMessages } from '../messages';

async function getPendingMessage(request: ExtensionConnectionMessage) {
  const params = request.params;
  const messageId = params && params[0];

  if (!messageId) {
    return {
      ...request,
      error: new Error('no message id in params'),
    };
  }

  const message = await firstValueFrom(
    pendingMessages.pipe(map((pending) => pending[messageId]))
  );

  if (!message) {
    return { ...request, error: new Error('no message found with that id') };
  }
  return { ...request, result: message };
}

export const GetPendingMessageRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.MESSAGE_GET_PENDING, getPendingMessage];
