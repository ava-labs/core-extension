import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetRecoveryPhraseExportStateHandler } from './getRecoveryPhraseExportState';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { SeedlessWallet } from '../SeedlessWallet';
import { buildRpcCall } from '@src/tests/test-utils';
import { AccountsService } from '../../accounts/AccountsService';

jest.mock('../SeedlessWallet');

describe('src/background/services/seedless/handlers/ge', () => {
  const secretsService = jest.mocked<SecretsService>({
    getPrimaryAccountSecrets: jest.fn(),
  } as any);
  const networkService = jest.mocked<NetworkService>({} as any);
  const mfaService = jest.mocked<SeedlessMfaService>({} as any);
  const accountsService = jest.mocked<AccountsService>({} as any);

  const handle = () => {
    const handler = new GetRecoveryPhraseExportStateHandler(
      secretsService,
      networkService,
      mfaService,
      accountsService,
    );

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE,
        id: 'abcd-1234',
      }),
    );
  };

  const wallet = jest.mocked<SeedlessWallet>({
    getMnemonicExportState: jest.fn(),
    cancelMnemonicExport: jest.fn(),
  } as any);

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(SeedlessWallet).mockReturnValue(wallet);

    secretsService.getPrimaryAccountSecrets.mockResolvedValue({
      secretType: SecretType.Seedless,
      publicKeys: [{ key: 'evm' }],
    } as any);
  });

  describe('for non-seedless wallets', () => {
    beforeEach(() => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValue({
        type: SecretType.Mnemonic,
      } as any);
    });

    it('returns undefined', async () => {
      const result = await handle();

      expect(result.result).toEqual(undefined);
    });
  });

  it('returns error if fetching the information fails', async () => {
    wallet.getMnemonicExportState.mockRejectedValueOnce(
      new Error('Session expired'),
    );

    const result = await handle();

    expect(result.error).toEqual('Session expired');
  });

  it('returns undefined if there are no pending exports', async () => {
    wallet.getMnemonicExportState.mockResolvedValueOnce(undefined);

    const result = await handle();

    expect(result.result).toEqual(undefined);
  });

  it('cancels outdated export requests', async () => {
    const now = 1_000_000_000;

    jest.spyOn(Date, 'now').mockReturnValue(now);

    const pendingExportMock = {
      key_id: 'Key#Mnemonic_ABCD1234',
      org_id: 'Org#XYZ-123',
      valid_epoch: now / 1000 - 11_000,
      exp_epoch: now / 1000 - 1000,
    };

    wallet.getMnemonicExportState.mockResolvedValueOnce(pendingExportMock);

    const result = await handle();

    expect(wallet.cancelMnemonicExport).toHaveBeenCalled();
    expect(result.result).toEqual(pendingExportMock);
  });

  it('returns export information if there is a pending export', async () => {
    const now = 1_000_000_000;

    jest.spyOn(Date, 'now').mockReturnValue(now);

    const pendingExportMock = {
      key_id: 'Key#Mnemonic_ABCD1234',
      org_id: 'Org#XYZ-123',
      valid_epoch: now / 1000 + 1000,
      exp_epoch: now / 1000 + 11_000,
    };

    wallet.getMnemonicExportState.mockResolvedValueOnce(pendingExportMock);

    const result = await handle();

    expect(result.result).toEqual(pendingExportMock);
  });
});
