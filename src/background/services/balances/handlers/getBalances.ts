import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { BalanceAggregatorService } from '../BalanceAggregatorService';
import type { BalancesInfo } from '../events/balancesUpdatedEvent';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_GET,
  BalancesInfo
>;

@injectable()
export class GetBalancesHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_GET as const;

  constructor(private networkBalancesService: BalanceAggregatorService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { balances, nfts, isBalancesCached } = this.networkBalancesService;

    return {
      ...request,
      result: {
        balances: {
          tokens: balances,
          nfts: nfts,
        },
        isBalancesCached,
      },
    };
  };
}
