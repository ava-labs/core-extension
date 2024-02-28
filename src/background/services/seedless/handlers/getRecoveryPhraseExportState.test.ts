import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetRecoveryPhraseExportStateHandler } from './getRecoveryPhraseExportState';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { SeedlessWallet } from '../SeedlessWallet';

jest.mock('../SeedlessWallet');

describe('src/background/services/seedless/handlers/ge', () => {
  const secretsService = jest.mocked<SecretsService>({
    getPrimaryAccountSecrets: jest.fn(),
  } as any);
  const networkService = jest.mocked<NetworkService>({} as any);
  const mfaService = jest.mocked<SeedlessMfaService>({} as any);

  const handle = () => {
    const handler = new GetRecoveryPhraseExportStateHandler(
      secretsService,
      networkService,
      mfaService
    );

    return handler.handle({
      method: ExtensionRequest.SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE,
      id: 'abcd-1234',
    });
  };

  const wallet = jest.mocked<SeedlessWallet>({
    getMnemonicExportState: jest.fn(),
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

    it('returns undefined', async () => {
      const result = await handle();

      expect(result.result).toEqual(undefined);
    });
  });

  it('returns error if fetching the information fails', async () => {
    wallet.getMnemonicExportState.mockRejectedValueOnce(
      new Error('Session expired')
    );

    const result = await handle();

    expect(result.error).toEqual('Session expired');
  });

  it('returns undefined if there are no pending exports', async () => {
    wallet.getMnemonicExportState.mockResolvedValueOnce(undefined);

    const result = await handle();

    expect(result.result).toEqual(undefined);
  });

  it('returns export information if there is a pending export', async () => {
    const pendingExportMock = {
      key_id: 'Key#Mnemonic_ABCD1234',
      org_id: 'Org#XYZ-123',
      valid_epoch: 1701990000,
      exp_epoch: 1702162800,
    };

    wallet.getMnemonicExportState.mockResolvedValueOnce(pendingExportMock);

    const result = await handle();

    expect(result.result).toEqual(pendingExportMock);
  });
});
