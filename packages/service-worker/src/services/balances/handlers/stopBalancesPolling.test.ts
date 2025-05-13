import { ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { BalancePollingService } from '~/services/balances/BalancePollingService';
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

    await handler.handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.BALANCES_STOP_POLLING,
      }),
    );

    expect(balancePollingService.stopPolling).toHaveBeenCalled();
  });
});
