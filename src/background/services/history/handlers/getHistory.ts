import { HistoryService } from './../HistoryService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';

@injectable()
export class GetHistoryHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.HISTORY_GET];

  constructor(private historyService: HistoryService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const history = await this.historyService.getTxHistory();
    return {
      ...request,
      result: history,
    };
  };
}
