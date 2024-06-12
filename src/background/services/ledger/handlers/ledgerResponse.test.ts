import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { LedgerResponseHandler } from './ledgerResponse';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/ledger/handlers/ledgerResponse.ts', () => {
  const response = { foo: 'bar' };
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_RESPONSE,
    params: [response],
  } as any;

  const ledgerServiceMock = {
    ledgerResponse: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('adds the response to the service correctly', async () => {
    const handler = new LedgerResponseHandler(ledgerServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: true });
    expect(ledgerServiceMock.ledgerResponse).toHaveBeenCalledWith(response);
  });
});
