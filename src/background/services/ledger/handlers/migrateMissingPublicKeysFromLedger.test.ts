import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletType } from '../../wallet/models';
import { MigrateMissingPublicKeysFromLedgerHandler } from './migrateMissingPublicKeysFromLedger';

describe('src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  } as any;

  const migrateMissingXPPublicKeysMock = jest.fn();
  const walletServiceMock = {
    walletType: WalletType.LEDGER,
    migrateMissingXPPublicKeys: migrateMissingXPPublicKeysMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('does nothing if wallet type is incorrect', async () => {
    const handler = new MigrateMissingPublicKeysFromLedgerHandler({
      ...walletServiceMock,
      walletType: WalletType.MNEMONIC,
    });
    const result = await handler.handle(request);

    expect(result).toEqual({ ...request, result: true });
    expect(walletServiceMock.migrateMissingXPPublicKeys).not.toHaveBeenCalled();
  });

  it('migrates the missing public keys', async () => {
    const handler = new MigrateMissingPublicKeysFromLedgerHandler(
      walletServiceMock
    );
    const result = await handler.handle(request);

    expect(result).toEqual({ ...request, result: true });
    expect(walletServiceMock.migrateMissingXPPublicKeys).toHaveBeenCalled();
  });
});
