import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { pendingMessages } from '../messages';

async function cancelPendingMessage(request: ExtensionConnectionMessage) {
  const params = request.params;
  const messageId = params && params[0];

  if (!messageId) {
    return {
      ...request,
      error: 'no message id in params',
    };
  }

  const messages = await firstValueFrom(pendingMessages);

  if (!messages) {
    return { ...request, error: 'no messages found' };
  }

  const message = messages[messageId];

  if (!message) {
    return { ...request, error: 'no message found with that id' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [messageId]: _removing, ...newPendingMessages } = messages;

  pendingMessages.next(newPendingMessages);

  return { ...request, result: true };
}

export const CancelPendingMessageRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.MESSAGE_CANCEL_PENDING, cancelPendingMessage];
