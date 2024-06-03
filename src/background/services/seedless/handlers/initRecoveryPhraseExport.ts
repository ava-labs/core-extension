import { injectable } from 'tsyringe';

import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { SeedlessWallet } from '../SeedlessWallet';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { UserExportInitResponse } from '@cubist-labs/cubesigner-sdk';
import { isExportRequestOutdated } from '../utils';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_INIT_RECOVERY_PHRASE_EXPORT,
  UserExportInitResponse
>;

@injectable()
export class InitRecoveryPhraseExportHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_INIT_RECOVERY_PHRASE_EXPORT as const;

  constructor(
    private secretsService: SecretsService,
    private networkService: NetworkService,
    private seedlessMfaService: SeedlessMfaService
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const secrets = await this.secretsService.getPrimaryAccountSecrets();

    if (secrets?.secretType !== SecretType.Seedless) {
      return {
        ...request,
        error: 'Action only available for seedless wallets',
      };
    }

    const wallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretsService),
      addressPublicKey: secrets.pubKeys[0],
      mfaService: this.seedlessMfaService,
    });

    const exportInProgress = await wallet.getMnemonicExportState();

    if (exportInProgress) {
      if (!isExportRequestOutdated(exportInProgress)) {
        return {
          ...request,
          error: 'Recovery phrase export is already in progress',
        };
      }

      // Cancel outdated requests if applicable
      await wallet.cancelMnemonicExport();
    }

    try {
      return {
        ...request,
        result: await wallet.initMnemonicExport(request.tabId),
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };
}
