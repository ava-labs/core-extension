import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';
import { ActionUpdate } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACTION_UPDATE,
  true,
  [ActionUpdate]
>;

@injectable()
export class UpdateActionHandler implements HandlerType {
  method = ExtensionRequest.ACTION_UPDATE as const;

  constructor(private actionsService: ActionsService) {}
  handle: HandlerType['handle'] = async (request) => {
    const { id, ...updates } = request.params[0];

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
