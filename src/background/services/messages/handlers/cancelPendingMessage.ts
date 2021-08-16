import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom, map } from 'rxjs';
import { pendingMessages } from '../messages';

async function cancelPendingMessage(request: ExtensionConnectionMessage) {
  const params = request.params;
  const messageId = params && params[0];

  if (!messageId) {
    return {
      ...request,
      error: new Error('no message id in params'),
    };
  }

  const messages = await firstValueFrom(pendingMessages);

  if (!messages) {
    return { ...request, error: new Error('no messages found') };
  }

  const message = messages[messageId];

  if (!message) {
    return { ...request, error: new Error('no message found with that id') };
  }

  const { [messageId]: _removing, ...newPendingMessages } = messages;

  pendingMessages.next(newPendingMessages);

  return { ...request, result: true };
}

export const CancelPendingMessageRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.MESSAGE_CANCEL_PENDING, cancelPendingMessage];
