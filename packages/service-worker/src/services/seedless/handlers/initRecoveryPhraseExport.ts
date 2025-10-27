import { injectable } from 'tsyringe';

import {
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretType,
} from '@core/types';

import { SecretsService } from '../../secrets/SecretsService';
import { SeedlessWallet } from '../SeedlessWallet';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { UserExportInitResponse } from '@cubist-labs/cubesigner-sdk';
import { isExportRequestOutdated } from '@core/common';
import { AccountsService } from '../../accounts/AccountsService';

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
