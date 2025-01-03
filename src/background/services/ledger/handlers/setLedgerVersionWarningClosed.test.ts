import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { LEDGER_VERSION_WARNING_WAS_CLOSED } from '../models';
import { LedgerVersionWarningClosedHandler } from './setLedgerVersionWarningClosed';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/ledger/handlers/setLedgerVersionWarningClosed.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED,
  } as any;

  const storageServiceMock = {
    saveToSessionStorage: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sets the warning closed flag to true correctly', async () => {
    const handler = new LedgerVersionWarningClosedHandler(storageServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: true });
    expect(storageServiceMock.saveToSessionStorage).toHaveBeenCalledWith(
      LEDGER_VERSION_WARNING_WAS_CLOSED,
      true,
    );
  });
});
