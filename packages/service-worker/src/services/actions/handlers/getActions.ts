import {
  Action,
  ExtensionRequest,
  ExtensionRequestHandler,
  MultiTxAction,
} from '@core/types';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';

export type HandlerType = ExtensionRequestHandler<
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
