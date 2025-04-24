import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';
import { ActionUpdate } from '@core/types/src/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACTION_UPDATE,
  true,
  [ActionUpdate, boolean | undefined]
>;

@injectable()
export class UpdateActionHandler implements HandlerType {
  method = ExtensionRequest.ACTION_UPDATE as const;

  constructor(private actionsService: ActionsService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { tabId } = request;
    const [{ id, ...updates }, shouldWaitForResponse] = request.params;
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

    const response = this.actionsService.updateAction({
      id,
      tabId,
      ...updates,
    });

    if (shouldWaitForResponse) {
      await response;
    }

    return { ...request, result: true };
  };
}
