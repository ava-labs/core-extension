import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BalancePollingService } from '../BalancePollingService';
import { StopBalancesPollingHandler } from './stopBalancesPolling';

describe('background/services/balances/handlers/stopBalancesPolling.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const balancePollingService = {
    stopPolling: jest.fn(),
  } as unknown as BalancePollingService;

  it('stops polling', async () => {
    const handler = new StopBalancesPollingHandler(balancePollingService);

    await handler.handle({
      id: '123',
      method: ExtensionRequest.BALANCES_STOP_POLLING,
    });

    expect(balancePollingService.stopPolling).toHaveBeenCalled();
  });
});
