import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ActionsService } from '../ActionsService';
import { SendErrorMessage } from '@src/utils/send/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACTION_UPDATE_TX_DATA,
  null,
  [
    id: string,
    newData: { maxFeeRate?: bigint; maxTipRate?: bigint; data?: string }
  ]
>;

@injectable()
export class UpdateActionTxDataHandler implements HandlerType {
  method = ExtensionRequest.ACTION_UPDATE_TX_DATA as const;

  constructor(private actionsService: ActionsService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const [id, newData] = request.params;

    if (!id) {
      return {
        ...request,
        error: 'no request id in params',
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

    try {
      await this.actionsService.updateTx(id, newData);
      return { ...request, result: null };
    } catch (err: any) {
      if (err?.message === 'Unable to create transaction') {
        return {
          ...request,
          error: SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE,
        };
      }

      return { ...request, error: err };
    }
  };
}
