import { PchainTxHistoryItem, XchainTxHistoryItem } from './../models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { TxHistoryItem } from '../models';
import { HistoryService } from './../HistoryService';
import { NetworkService } from '../../network/NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.HISTORY_GET,
  TxHistoryItem[] | PchainTxHistoryItem[] | XchainTxHistoryItem[]
>;

@injectable()
export class GetHistoryHandler implements HandlerType {
  method = ExtensionRequest.HISTORY_GET as const;

  constructor(
    private historyService: HistoryService,
    private networkService: NetworkService
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const network = await this.networkService.getNetwork(scope);

    if (!network) {
      return {
        ...request,
        result: [],
      };
    }

    const history = await this.historyService.getTxHistory(network);

    return {
      ...request,
      result: history,
    };
  };
}
