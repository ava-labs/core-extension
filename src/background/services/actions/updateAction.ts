import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { pendingActions$ } from './actions';
import { ActionUpdate } from './models';

async function updateActionById(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: 'no params on request',
    };
  }

  const { id, ...updates } = params[0] as ActionUpdate;

  if (!id) {
    return {
      ...request,
      error: 'no message id in params',
    };
  }

  const actions = await firstValueFrom(pendingActions$);

  if (!actions) {
    return { ...request, error: 'no messages found' };
  }

  const action = actions[id];

  if (!action) {
    return { ...request, error: 'no message found with that id' };
  }

  pendingActions$.next({
    ...actions,
    [id]: {
      ...action,
      ...updates,
    },
  });

  return { ...request, result: true };
}

export const UpdateActionByIdRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.ACTION_UPDATE, updateActionById];
