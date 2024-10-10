import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { InitRecoveryPhraseExportHandler } from './initRecoveryPhraseExport';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { SeedlessWallet } from '../SeedlessWallet';
import { buildRpcCall } from '@src/tests/test-utils';
import { AccountsService } from '../../accounts/AccountsService';

jest.mock('../SeedlessWallet');

describe('src/background/services/seedless/handlers/initRecoveryPhraseExport', () => {
  const secretsService = jest.mocked<SecretsService>({
    getPrimaryAccountSecrets: jest.fn(),
  } as any);
  const networkService = jest.mocked<NetworkService>({} as any);
  const mfaService = jest.mocked<SeedlessMfaService>({} as any);
  const accountsService = jest.mocked<AccountsService>({} as any);

  const handle = () => {
    const handler = new InitRecoveryPhraseExportHandler(
      secretsService,
      networkService,
      mfaService,
      accountsService
    );

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_INIT_RECOVERY_PHRASE_EXPORT,
        id: 'abcd-1234',
      })
    );
  };

  const wallet = jest.mocked<SeedlessWallet>({
    getMnemonicExportState: jest.fn(),
    initMnemonicExport: jest.fn(),
    cancelMnemonicExport: jest.fn(),
  } as any);

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(SeedlessWallet).mockReturnValue(wallet);

    secretsService.getPrimaryAccountSecrets.mockResolvedValue({
      secretType: SecretType.Seedless,
      pubKeys: [
        {
          evm: 'evm',
          xp: 'xp',
        },
      ],
    } as any);
  });

  describe('for non-seedless wallets', () => {
    beforeEach(() => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValue({
        type: SecretType.Mnemonic,
      } as any);
    });

    it('returns error', async () => {
      const result = await handle();

      expect(result.error).toEqual(
        'Action only available for seedless wallets'
      );
    });
  });

  it('returns error if export is already in progress', async () => {
    wallet.getMnemonicExportState.mockResolvedValueOnce({
      key_id: 'key',
    } as any);

    const result = await handle();

    expect(result.error).toEqual(
      'Recovery phrase export is already in progress'
    );
  });

  it('returns error if export initialization fails', async () => {
    wallet.initMnemonicExport.mockRejectedValueOnce(
      new Error('Session does not have required scopes: [ExportUserInit]')
    );

    const result = await handle();

    expect(result.error).toEqual(
      'Session does not have required scopes: [ExportUserInit]'
    );
  });

  it('returns export information when initialization succeeds', async () => {
    const pendingExportMock = {
      key_id: 'Key#Mnemonic_ABCD1234',
      org_id: 'Org#XYZ-123',
      valid_epoch: 1701990000,
      exp_epoch: 1702162800,
    };

    wallet.initMnemonicExport.mockResolvedValueOnce(pendingExportMock);

    const result = await handle();

    expect(result.result).toEqual(pendingExportMock);
  });
});
