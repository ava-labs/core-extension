import {
  Account,
  AtomicBalances,
  Balances,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { caipToChainId } from '@core/common';
import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';
import { BalancePollingService } from '~/services/balances/BalancePollingService';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_START_POLLING,
  {
    balances: {
      tokens: Balances;
      nfts: Balances<NftTokenWithBalance>;
      atomic: AtomicBalances;
    };
    isBalancesCached: boolean;
  },
  [account: Account, roundRobinChainIds: number[], tokenTypes: TokenType[]]
>;

@injectable()
export class StartBalancesPollingHandler implements HandlerType {
  method = ExtensionRequest.BALANCES_START_POLLING as const;

  constructor(
    private pollingService: BalancePollingService,
    private aggregatorService: BalanceAggregatorService,
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    if (scope && !this.pollingService.isPollingActive) {
      const activeChainId = caipToChainId(scope);
      const [account, roundRobinChainIds, tokenTypes] = request.params;

      this.pollingService.startPolling(
        account,
        activeChainId,
        roundRobinChainIds,
        tokenTypes,
      );
    }

    const { balances, nfts, isBalancesCached, atomicBalances } =
      this.aggregatorService;

    return {
      ...request,
      result: {
        balances: {
          tokens: balances,
          nfts,
          atomic: atomicBalances,
        },
        isBalancesCached,
      },
    };
  };
}
