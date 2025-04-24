import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';
import { Action, MultiTxAction } from '@core/types/src/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACTION_GET,
  Action | MultiTxAction,
  [messageId: string]
>;

@injectable()
export class GetActionHandler implements HandlerType {
  method = ExtensionRequest.ACTION_GET as const;

  constructor(private actionsService: ActionsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [messageId] = request.params;

    const currentPendingActions = await this.actionsService.getActions();
    const message = currentPendingActions[messageId];

    if (!message) {
      return { ...request, error: 'no message found with that id' };
    }

    return { ...request, result: message };
  };
}
