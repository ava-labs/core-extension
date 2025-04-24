import {
  userExportDecrypt,
  userExportKeygen,
} from '@cubist-labs/cubesigner-sdk';

import { ExtensionRequest } from '@core/types';

import { CompleteRecoveryPhraseExportHandler } from './completeRecoveryPhraseExport';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { SeedlessWallet } from '../SeedlessWallet';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@core/common';
import { buildRpcCall } from '@src/tests/test-utils';
import { AccountsService } from '../../accounts/AccountsService';

jest.mock('../SeedlessWallet');
jest.mock('@cubist-labs/cubesigner-sdk');
jest.mock('@src/monitoring/sentryCaptureException');

describe('src/background/services/seedless/handlers/completeRecoveryPhraseExport', () => {
  const secretsService = jest.mocked<SecretsService>({
    getPrimaryAccountSecrets: jest.fn(),
  } as any);
  const networkService = jest.mocked<NetworkService>({} as any);
  const mfaService = jest.mocked<SeedlessMfaService>({} as any);
  const accountsService = jest.mocked<AccountsService>({} as any);

  const handle = () => {
    const handler = new CompleteRecoveryPhraseExportHandler(
      secretsService,
      networkService,
      mfaService,
      accountsService,
    );

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT,
        id: 'abcd-1234',
      }),
    );
  };

  const wallet = jest.mocked<SeedlessWallet>({
    completeMnemonicExport: jest.fn(),
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

    it('returns error', async () => {
      const result = await handle();

      expect(result.error).toEqual(
        'Action only available for seedless wallets',
      );
    });
  });

  it('logs & returns error if export key pair generation fails', async () => {
    const err = new Error('Some error');
    jest.mocked(userExportKeygen).mockRejectedValueOnce(err);

    const result = await handle();

    expect(sentryCaptureException).toHaveBeenCalledWith(
      err,
      SentryExceptionTypes.SEEDLESS,
    );
    expect(result.error).toEqual('Failed to generate the encryption key pair');
  });

  it('logs & returns error if complete export request fails', async () => {
    const err = new Error('Some API error');

    jest
      .mocked(userExportKeygen)
      .mockResolvedValueOnce({ publicKey: 'asd', privateKey: 'asd' } as any);
    wallet.completeMnemonicExport.mockRejectedValueOnce(err);

    const result = await handle();

    expect(sentryCaptureException).toHaveBeenCalledWith(
      err,
      SentryExceptionTypes.SEEDLESS,
    );
    expect(result.error).toEqual(
      'Failed to complete the recovery phrase export',
    );
  });

  it('logs & returns error if mnemonic decryption fails', async () => {
    const err = new Error('Some decryption error');

    jest
      .mocked(userExportKeygen)
      .mockResolvedValueOnce({ publicKey: 'asd', privateKey: 'asd' } as any);

    wallet.completeMnemonicExport.mockResolvedValue({} as any);

    jest.mocked(userExportDecrypt).mockRejectedValueOnce(err);

    const result = await handle();

    expect(sentryCaptureException).toHaveBeenCalledWith(
      err,
      SentryExceptionTypes.SEEDLESS,
    );
    expect(result.error).toEqual('Failed to decrypt the recovery phrase');
  });

  it('logs & returns error if decrypted result does not contain the mnemonic', async () => {
    jest
      .mocked(userExportKeygen)
      .mockResolvedValueOnce({ publicKey: 'asd', privateKey: 'asd' } as any);

    wallet.completeMnemonicExport.mockResolvedValue({} as any);

    jest.mocked(userExportDecrypt).mockResolvedValueOnce({} as any);

    const result = await handle();

    expect(sentryCaptureException).toHaveBeenCalledWith(
      new Error('Export decrypted, but has no mnemonic'),
      SentryExceptionTypes.SEEDLESS,
    );
    expect(result.error).toEqual(
      'Unexpected error occured while decrypting the recovery phrase',
    );
  });

  it('returns the decrypted mnemonic if everything succeeds', async () => {
    jest
      .mocked(userExportKeygen)
      .mockResolvedValueOnce({ publicKey: 'asd', privateKey: 'asd' } as any);

    wallet.completeMnemonicExport.mockResolvedValue({} as any);

    jest.mocked(userExportDecrypt).mockResolvedValueOnce({
      mnemonic: 'mnemonic',
    } as any);

    const result = await handle();

    expect(result.result).toEqual('mnemonic');
  });
});
