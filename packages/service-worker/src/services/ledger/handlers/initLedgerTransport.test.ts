import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';
import { InitLedgerTransportHandler } from './initLedgerTransport';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/ledger/handlers/initLedgerTransport.ts', () => {
  const transportId = '1';
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
    params: [transportId],
  } as any;

  const ledgerServiceMock = {
    getTransport: jest.fn(),
    initTransport: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns early if transport has been already initiated', async () => {
    ledgerServiceMock.getTransport.mockResolvedValueOnce({ foo: 'bar' });
    const handler = new InitLedgerTransportHandler(ledgerServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: true });
    expect(ledgerServiceMock.getTransport).toHaveBeenCalledWith(transportId);
    expect(ledgerServiceMock.initTransport).not.toHaveBeenCalled();
  });

  it('returns any errors during initialization', async () => {
    const error = new Error('some error');
    ledgerServiceMock.initTransport.mockImplementationOnce(() => {
      throw error;
    });
    const handler = new InitLedgerTransportHandler(ledgerServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, error: error.message });
    expect(ledgerServiceMock.getTransport).toHaveBeenCalledWith(transportId);
    expect(ledgerServiceMock.initTransport).toHaveBeenCalledWith(transportId);
  });

  it('initiates the transport correctly', async () => {
    const handler = new InitLedgerTransportHandler(ledgerServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: true });
    expect(ledgerServiceMock.getTransport).toHaveBeenCalledWith(transportId);
    expect(ledgerServiceMock.initTransport).toHaveBeenCalledWith(transportId);
  });
});
