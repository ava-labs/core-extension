import { buildRpcCall } from '@src/tests/test-utils';
import type { LockService } from '../../lock/LockService';
import { SecretType } from '../../secrets/models';
import type { SecretsService } from '../../secrets/SecretsService';
import { GetUnencryptedMnemonicHandler } from './getUnencryptedMnemonic';
import type { AccountsService } from '../../accounts/AccountsService';
import type { Account } from '../../accounts/models';

describe('src/background/services/wallet/handlers/getUnencryptedMnemonic.ts', () => {
  const lockService: jest.Mocked<LockService> = {
    verifyPassword: jest.fn(),
  } as any;
  const secretsService: jest.Mocked<SecretsService> = {
    getAccountSecrets: jest.fn(),
  } as any;

  const accountsService: jest.Mocked<AccountsService> = {
    activeAccount: {} as unknown as Account,
  } as any;

  const buildHandler = () =>
    new GetUnencryptedMnemonicHandler(
      secretsService,
      lockService,
      accountsService,
    );

  it('returns error if password is invalid', async () => {
    lockService.verifyPassword.mockResolvedValue(false);

    const handler = buildHandler();

    expect(
      await handler.handle(buildRpcCall({ params: ['abcd'] } as any)),
    ).toEqual(
      expect.objectContaining({
        error: 'Password invalid',
      }),
    );
  });

  it('returns error if storage does not contain mnemonic', async () => {
    lockService.verifyPassword.mockResolvedValue(true);
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
    } as any);

    const handler = buildHandler();

    expect(
      await handler.handle(buildRpcCall({ params: ['abcd'] } as any)),
    ).toEqual(
      expect.objectContaining({
        error: 'Not a MnemonicWallet',
      }),
    );
  });

  it('returns the mnemonic properly', async () => {
    const mnemonic = 'super-complex-mnemonic';
    lockService.verifyPassword.mockResolvedValue(true);
    secretsService.getAccountSecrets.mockResolvedValue({
      secretType: SecretType.Mnemonic,
      mnemonic,
    } as any);
    const handler = buildHandler();

    expect(
      await handler.handle(buildRpcCall({ params: ['abcd'] } as any)),
    ).toEqual(
      expect.objectContaining({
        result: mnemonic,
      }),
    );
  });
});
