import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { BalanceAggregatorService } from '../BalanceAggregatorService';
import type { BalancePollingService } from '../BalancePollingService';
import type { Balances } from '../models';
import type { Account } from '../../accounts/models';
import { caipToChainId } from '@src/utils/caipConversion';
import type { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCES_START_POLLING,
  {
    balances: {
      tokens: Balances;
      nfts: Balances<NftTokenWithBalance>;
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

    const { balances, nfts, isBalancesCached } = this.aggregatorService;

    return {
      ...request,
      result: {
        balances: {
          tokens: balances,
          nfts,
        },
        isBalancesCached,
      },
    };
  };
}
