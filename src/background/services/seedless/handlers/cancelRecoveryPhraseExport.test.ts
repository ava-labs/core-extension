import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { CancelRecoveryPhraseExportHandler } from './cancelRecoveryPhraseExport';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { SeedlessWallet } from '../SeedlessWallet';

jest.mock('../SeedlessWallet');

describe('src/background/services/seedless/handlers/cancelRecoveryPhraseExport', () => {
  const secretsService = jest.mocked<SecretsService>({
    getPrimaryAccountSecrets: jest.fn(),
  } as any);
  const networkService = jest.mocked<NetworkService>({} as any);
  const mfaService = jest.mocked<SeedlessMfaService>({} as any);

  const handle = () => {
    const handler = new CancelRecoveryPhraseExportHandler(
      secretsService,
      networkService,
      mfaService
    );

    return handler.handle({
      method: ExtensionRequest.SEEDLESS_CANCEL_RECOVERY_PHRASE_EXPORT,
      id: 'abcd-1234',
    });
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

  it('returns error if there are no pending export requests', async () => {
    wallet.getMnemonicExportState.mockResolvedValueOnce(undefined);

    const result = await handle();

    expect(result.error).toEqual('There are no pending export requests');
  });

  it('returns error if export cancellation fails', async () => {
    wallet.getMnemonicExportState.mockResolvedValueOnce({} as any);
    wallet.cancelMnemonicExport.mockRejectedValueOnce(
      new Error('Session expired')
    );

    const result = await handle();

    expect(result.error).toEqual('Session expired');
  });

  it('returns true when cancellation succeeds', async () => {
    wallet.getMnemonicExportState.mockResolvedValueOnce({} as any);
    wallet.cancelMnemonicExport.mockResolvedValueOnce();

    const result = await handle();

    expect(result.result).toEqual(true);
  });
});
