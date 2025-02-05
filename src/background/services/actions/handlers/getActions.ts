import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { ActionsService } from '../ActionsService';
import type { Action, MultiTxAction } from '../models';

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
