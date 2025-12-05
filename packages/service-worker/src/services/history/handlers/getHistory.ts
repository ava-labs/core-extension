import {
  ExtensionRequest,
  ExtensionRequestHandler,
  TxHistoryItem,
} from '@core/types';
import { injectable } from 'tsyringe';
import { HistoryService } from '../HistoryService';
import { NetworkService } from '../../network/NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.HISTORY_GET,
  TxHistoryItem[],
  [address: string] | undefined
>;

@injectable()
export class GetHistoryHandler implements HandlerType {
  method = ExtensionRequest.HISTORY_GET as const;

  constructor(
    private historyService: HistoryService,
    private networkService: NetworkService,
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const network = await this.networkService.getNetwork(scope);

    if (!network) {
      return {
        ...request,
        result: [],
      };
    }

    const history = await this.historyService.getTxHistory(
      network,
      request.params?.[0],
    );

    return {
      ...request,
      result: history,
    };
  };
}
