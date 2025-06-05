import { TokenType } from '@avalabs/vm-module-types';
import { caipToChainId } from '@core/common';
import { ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';
import { BalancePollingService } from '~/services/balances/BalancePollingService';
import { StartBalancesPollingHandler } from './startBalancesPolling';

jest.mock('@core/common');

describe('background/services/balances/handlers/startBalancesPolling.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(caipToChainId).mockReturnValue(43114);
  });

  const account = {} as any;
  const chainIds = [2, 3, 4];

  describe('when balance polling is not active', () => {
    const balancePollingService = {
      isPollingActive: false,
      startPolling: jest.fn(),
    } as unknown as BalancePollingService;

    const aggregatorService = {
      balances: {},
      nfts: { [123]: {} },
      isBalancesCached: false,
    } as unknown as BalanceAggregatorService;

    it('returns current balances', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService,
      );

      const { result } = await handler.handle(
        buildRpcCall({
          id: '123',
          method: ExtensionRequest.BALANCES_START_POLLING,
          params: [account, chainIds],
        }),
      );

      expect(result).toEqual({
        balances: {
          tokens: aggregatorService.balances,
          nfts: aggregatorService.nfts,
        },
        isBalancesCached: aggregatorService.isBalancesCached,
      });
    });
    it('starts polling', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService,
      );

      const scope = 'eip155:43114';

      await handler.handle(
        buildRpcCall(
          {
            id: '123',
            method: ExtensionRequest.BALANCES_START_POLLING,
            params: [account, chainIds, [TokenType.ERC20]],
          },
          scope,
        ),
      );

      expect(balancePollingService.startPolling).toHaveBeenCalledWith(
        account,
        caipToChainId(scope),
        chainIds,
        [TokenType.ERC20],
      );
    });
  });

  describe('when balance polling is already active', () => {
    const balancePollingService = {
      isPollingActive: true,
      startPolling: jest.fn(),
    } as unknown as BalancePollingService;

    const aggregatorService = {
      balances: {},
      nfts: { [123]: {} },
      isBalancesCached: undefined,
    } as unknown as BalanceAggregatorService;

    it('returns current balances', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService,
      );

      const { result } = await handler.handle(
        buildRpcCall({
          id: '123',
          method: ExtensionRequest.BALANCES_START_POLLING,
          params: [account, chainIds],
        }),
      );

      expect(result).toEqual({
        balances: {
          tokens: aggregatorService.balances,
          nfts: aggregatorService.nfts,
        },
        isBalancesCached: aggregatorService.isBalancesCached,
      });
    });

    it('does not start polling', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService,
      );

      await handler.handle(
        buildRpcCall({
          id: '123',
          method: ExtensionRequest.BALANCES_START_POLLING,
          params: [account, chainIds],
        }),
      );

      expect(balancePollingService.startPolling).not.toHaveBeenCalled();
    });
  });
});
