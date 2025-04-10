import { injectable } from 'tsyringe';
import {
  EvmTxUpdateFn,
  BtcTxUpdateFn,
  EvmTxBatchUpdateFn,
} from '@avalabs/vm-module-types';

import { SendErrorMessage } from '@src/utils/send/models';
import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { ExtensionRequestHandler } from '../../../connections/models';

import { ActionsService } from '../ActionsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACTION_UPDATE_TX_DATA,
  null,
  | [
      id: string,
      newData: Parameters<EvmTxUpdateFn>[0] | Parameters<BtcTxUpdateFn>[0],
    ]
  | [id: string, newData: Parameters<EvmTxBatchUpdateFn>[0], txIndex: number]
>;

@injectable()
export class UpdateActionTxDataHandler implements HandlerType {
  method = ExtensionRequest.ACTION_UPDATE_TX_DATA as const;

  constructor(private actionsService: ActionsService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const [id, newData, txIndex] = request.params;

    if (!id) {
      return {
        ...request,
        error: 'no request id in params',
      };
    }

    const actions = await this.actionsService.getActions();

    if (!actions) {
      return { ...request, error: 'no pending requests found' };
    }

    const action = actions[id];

    if (!action) {
      return { ...request, error: 'no request found with that id' };
    }

    try {
      await this.actionsService.updateTx(id, newData, txIndex);
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
