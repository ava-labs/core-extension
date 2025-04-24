import { ExtensionRequest } from '@core/types';
import { LEDGER_VERSION_WARNING_WAS_CLOSED } from '@core/types';
import { GetLedgerVersionWarningHandler } from './getLedgerVersionWarning';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/ledger/handlers/getLedgerVersionWarning.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.SHOW_LEDGER_VERSION_WARNING,
  } as any;

  const storageServiceMock = {
    loadFromSessionStorage: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('correctly returns if warning has been already showed', async () => {
    storageServiceMock.loadFromSessionStorage.mockResolvedValueOnce(false);
    const handler = new GetLedgerVersionWarningHandler(storageServiceMock);
    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({ ...request, result: false });
    expect(storageServiceMock.loadFromSessionStorage).toHaveBeenCalledWith(
      LEDGER_VERSION_WARNING_WAS_CLOSED,
    );
  });
});
