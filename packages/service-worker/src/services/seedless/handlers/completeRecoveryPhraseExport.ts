import { injectable } from 'tsyringe';
import {
  userExportDecrypt,
  userExportKeygen,
} from '@cubist-labs/cubesigner-sdk';

import {
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretType,
} from '@core/types';

import { SecretsService } from '../../secrets/SecretsService';
import { SeedlessWallet } from '../SeedlessWallet';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { NetworkService } from '../../network/NetworkService';
import { Monitoring } from '@core/common';
import { AccountsService } from '../../accounts/AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT,
  string
>;

@injectable()
export class CompleteRecoveryPhraseExportHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT as const;

  constructor(
    private secretsService: SecretsService,
    private networkService: NetworkService,
    private seedlessMfaService: SeedlessMfaService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const activeAccount = await this.accountsService.getActiveAccount();
    const secrets =
      await this.secretsService.getPrimaryAccountSecrets(activeAccount);

    if (secrets?.secretType !== SecretType.Seedless) {
      return {
        ...request,
        error: 'Action only available for seedless wallets',
      };
    }

    const wallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretsService),
      addressPublicKeys: secrets.publicKeys,
      mfaService: this.seedlessMfaService,
    });

    let keyPair: CryptoKeyPair;

    try {
      keyPair = await userExportKeygen();
    } catch (err) {
      Monitoring.sentryCaptureException(
        err as Error,
        Monitoring.SentryExceptionTypes.SEEDLESS,
      );

      return {
        ...request,
        error: 'Failed to generate the encryption key pair',
      };
    }

    let exportResponse: Awaited<
      ReturnType<SeedlessWallet['completeMnemonicExport']>
    >;

    try {
      exportResponse = await wallet.completeMnemonicExport(
        keyPair.publicKey,
        request.tabId,
      );
    } catch (err) {
      Monitoring.sentryCaptureException(
        err as Error,
        Monitoring.SentryExceptionTypes.SEEDLESS,
      );

      return {
        ...request,
        error: 'Failed to complete the recovery phrase export',
      };
    }

    try {
      const exportDecrypted = await userExportDecrypt(
        keyPair.privateKey,
        exportResponse,
      );

      const hasMnemonic = 'mnemonic' in exportDecrypted;

      if (!hasMnemonic || typeof exportDecrypted.mnemonic !== 'string') {
        Monitoring.sentryCaptureException(
          new Error('Export decrypted, but has no mnemonic'),
          Monitoring.SentryExceptionTypes.SEEDLESS,
        );

        return {
          ...request,
          error:
            'Unexpected error occured while decrypting the recovery phrase',
        };
      }

      return {
        ...request,
        result: exportDecrypted.mnemonic,
      };
    } catch (err) {
      Monitoring.sentryCaptureException(
        err as Error,
        Monitoring.SentryExceptionTypes.SEEDLESS,
      );

      return {
        ...request,
        error: 'Failed to decrypt the recovery phrase',
      };
    }
  };
}
