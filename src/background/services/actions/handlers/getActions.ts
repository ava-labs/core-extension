import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';

@injectable()
export class GetActionHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ACTION_GET];

  constructor(private actionsService: ActionsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
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

    const currentPendingActions = await this.actionsService.getActions();
    const message = currentPendingActions[messageId];

    if (!message) {
      return { ...request, error: 'no message found with that id' };
    }

    return { ...request, result: message };
  };
}
