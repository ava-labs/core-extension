import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED } from '../models';
import { GetLedgerIncorrectBtcAppWarningHandler } from './getLedgerIncorrectBtcAppWarning';

describe('src/background/services/ledger/handlers/getLedgerIncorrectBtcAppWarning.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.SHOW_LEDGER_INCORRECT_BTC_APP_WARNING,
  } as any;

  const storageServiceMock = {
    loadFromSessionStorage: jest.fn().mockResolvedValue(true),
  } as any;

  it('gets the value of LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED flag from the session storage', async () => {
    const handler = new GetLedgerIncorrectBtcAppWarningHandler(
      storageServiceMock
    );

    const result = await handler.handle(request);

    expect(result).toStrictEqual({ ...request, result: true });
    expect(storageServiceMock.loadFromSessionStorage).toHaveBeenCalledWith(
      LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED
    );
  });
});
