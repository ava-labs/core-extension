import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED } from '../models';
import { LedgerIncorrectBtcAppWarningClosedHandler } from './setLedgerIncorrectBtcAppWarningClosed';

describe('src/background/services/ledger/handlers/setLedgerIncorrectBtcAppWarningClosed.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_INCORRECT_BTC_APP_WARNING_CLOSED,
  } as any;

  const storageServiceMock = {
    saveToSessionStorage: jest.fn(),
  } as any;

  it('sets the LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED flag to true in the session storage', async () => {
    const handler = new LedgerIncorrectBtcAppWarningClosedHandler(
      storageServiceMock
    );

    const result = await handler.handle(request);

    expect(result).toStrictEqual({ ...request, result: true });
    expect(storageServiceMock.saveToSessionStorage).toHaveBeenCalledWith(
      LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED,
      true
    );
  });
});
