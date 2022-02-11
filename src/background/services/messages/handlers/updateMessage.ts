import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { pendingMessages$ } from '../messages';
import { MessageUpdate } from '../models';

async function updateMessageById(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: 'no params on request',
    };
  }

  const { id, ...updates } = params[0] as MessageUpdate;

  if (!id) {
    return {
      ...request,
      error: 'no message id in params',
    };
  }

  const messages = await firstValueFrom(pendingMessages$);

  if (!messages) {
    return { ...request, error: 'no messages found' };
  }

  const message = messages[id];

  if (!message) {
    return { ...request, error: 'no message found with that id' };
  }

  pendingMessages$.next({
    ...messages,
    [id]: {
      ...message,
      ...updates,
    },
  });

  return { ...request, result: true };
}

export const UpdateMessageByIdRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.MESSAGE_UPDATE, updateMessageById];
