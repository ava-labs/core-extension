import { ExtensionRequest } from '@core/types';
import { RemoveLedgerTransportHandler } from './removeLedgerTransport';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/ledger/handlers/removeLedgerTransport.ts', () => {
  const transportId = '1';
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_REMOVE_TRANSPORT,
    params: [transportId],
  } as any;

  const ledgerServiceMock = {
    getTransport: jest.fn(),
    removeTransportFromCache: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('does nothing if the provided transport does not exist', async () => {
    const handler = new RemoveLedgerTransportHandler(ledgerServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: true });
    expect(ledgerServiceMock.getTransport).toHaveBeenCalledWith(transportId);
    expect(ledgerServiceMock.removeTransportFromCache).not.toHaveBeenCalled();
  });

  it('removes the provided transport correctly', async () => {
    ledgerServiceMock.getTransport.mockReturnValueOnce({ foo: 'bar' });
    const handler = new RemoveLedgerTransportHandler(ledgerServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: true });
    expect(ledgerServiceMock.getTransport).toHaveBeenCalledWith(transportId);
    expect(ledgerServiceMock.removeTransportFromCache).toHaveBeenCalledWith(
      transportId,
    );
  });
});
