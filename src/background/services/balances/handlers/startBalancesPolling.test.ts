import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { BalancePollingService } from '../BalancePollingService';
import { StartBalancesPollingHandler } from './startBalancesPolling';

describe('background/services/balances/handlers/startBalancesPolling.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('when balance polling is not active', () => {
    const balancePollingService = {
      isPollingActive: false,
      startPolling: jest.fn().mockResolvedValue(true),
      startAsSoonAsAccountIsSelected: jest.fn(),
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

      const { result } = await handler.handle({
        id: '123',
        method: ExtensionRequest.BALANCES_START_POLLING,
      });

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

      await handler.handle({
        id: '123',
        method: ExtensionRequest.BALANCES_START_POLLING,
      });

      expect(balancePollingService.startPolling).toHaveBeenCalled();
    });
  });

  describe('when balance polling does not start', () => {
    const balancePollingService = {
      isPollingActive: false,
      startPolling: jest.fn().mockResolvedValue(false),
      startAsSoonAsAccountIsSelected: jest.fn(),
    } as unknown as BalancePollingService;

    const aggregatorService = {
      balances: {},
    } as unknown as BalanceAggregatorService;

    it('schedules it to start when account is switched', async () => {
      const handler = new StartBalancesPollingHandler(
        balancePollingService,
        aggregatorService
      );

      await handler.handle({
        id: '123',
        method: ExtensionRequest.BALANCES_START_POLLING,
      });

      expect(
        balancePollingService.startAsSoonAsAccountIsSelected
      ).toHaveBeenCalledWith();
    });
  });

  describe('when balance polling is already active', () => {
    const balancePollingService = {
      isPollingActive: true,
      startPolling: jest.fn().mockResolvedValue(true),
      startAsSoonAsAccountIsSelected: jest.fn(),
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

      const { result } = await handler.handle({
        id: '123',
        method: ExtensionRequest.BALANCES_START_POLLING,
      });

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

      await handler.handle({
        id: '123',
        method: ExtensionRequest.BALANCES_START_POLLING,
      });

      expect(balancePollingService.startPolling).not.toHaveBeenCalled();
    });
  });
});
