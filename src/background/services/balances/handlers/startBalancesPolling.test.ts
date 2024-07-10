import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { BalancePollingService } from '../BalancePollingService';
import { StartBalancesPollingHandler } from './startBalancesPolling';
import { buildRpcCall } from '@src/tests/test-utils';
import { caipToChainId } from '@src/utils/caipConversion';

jest.mock('@src/utils/caipConversion');

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
      isBalancesCached: false,
    } as unknown as BalanceAggregatorService;

    it('returns current balances', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService
      );

      const { result } = await handler.handle(
        buildRpcCall({
          id: '123',
          method: ExtensionRequest.BALANCES_START_POLLING,
          params: [account, chainIds],
        })
      );

      expect(result).toEqual({
        balances: aggregatorService.balances,
        isBalancesCached: aggregatorService.isBalancesCached,
      });
    });
    it('starts polling', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService
      );

      const scope = 'eip155:43114';

      await handler.handle(
        buildRpcCall(
          {
            id: '123',
            method: ExtensionRequest.BALANCES_START_POLLING,
            params: [account, chainIds],
          },
          scope
        )
      );

      expect(balancePollingService.startPolling).toHaveBeenCalledWith(
        account,
        caipToChainId(scope),
        chainIds
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
      isBalancesCached: undefined,
    } as unknown as BalanceAggregatorService;

    it('returns current balances', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService
      );

      const { result } = await handler.handle(
        buildRpcCall({
          id: '123',
          method: ExtensionRequest.BALANCES_START_POLLING,
          params: [account, chainIds],
        })
      );

      expect(result).toEqual({
        balances: aggregatorService.balances,
        isBalancesCached: aggregatorService.isBalancesCached,
      });
    });

    it('does not start polling', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService
      );

      await handler.handle(
        buildRpcCall({
          id: '123',
          method: ExtensionRequest.BALANCES_START_POLLING,
          params: [account, chainIds],
        })
      );

      expect(balancePollingService.startPolling).not.toHaveBeenCalled();
    });
  });
});
