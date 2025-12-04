import {
  BalancesInfo,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_GET,
  BalancesInfo
>;

@injectable()
export class GetBalancesHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_GET as const;

  constructor(private networkBalancesService: BalanceAggregatorService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { balances, nfts, isBalancesCached, atomicBalances } =
      this.networkBalancesService;

    return {
      ...request,
      result: {
        balances: {
          tokens: balances,
          nfts: nfts,
          atomic: atomicBalances,
        },
        isBalancesCached,
      },
    };
  };
}
