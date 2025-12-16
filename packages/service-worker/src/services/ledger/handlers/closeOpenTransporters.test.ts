import { ExtensionRequest } from '@core/types';
import { CloseLedgerTransportHandler } from './closeOpenTransporters';
import { buildRpcCall } from '@shared/tests/test-utils';

describe('src/background/services/ledger/handlers/closeOpenTransporters.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
    params: {
      currentTransportUUID: 'id',
    },
  } as any;

  const ledgerServiceMock = {
    closeOpenedTransport: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('requests all transports to be closed', async () => {
    const handler = new CloseLedgerTransportHandler(ledgerServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: true });
    expect(ledgerServiceMock.closeOpenedTransport).toHaveBeenCalledWith('id');
  });
});
