import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';
import { ActionUpdate } from '../models';

@injectable()
export class UpdateActionHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ACTION_UPDATE];

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

    const { id, ...updates } = params[0] as ActionUpdate;

    if (!id) {
      return {
        ...request,
        error: 'no message id in params',
      };
    }

    const actions = await this.actionsService.getActions();

    if (!actions) {
      return { ...request, error: 'no messages found' };
    }

    const action = actions[id];

    if (!action) {
      return { ...request, error: 'no message found with that id' };
    }

    this.actionsService.updateAction({ id, ...updates });

    return { ...request, result: true };
  };
}
