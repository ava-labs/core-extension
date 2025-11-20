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
  ExtensionRequest.SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE,
  UserExportInitResponse | undefined
>;

@injectable()
export class GetRecoveryPhraseExportStateHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE as const;

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
        result: undefined,
      };
    }

    const wallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretsService),
      addressPublicKeys: secrets.publicKeys,
      mfaService: this.seedlessMfaService,
    });

    try {
      const exportRequest = await wallet.getMnemonicExportState();

      // Cancel outdated requests, but still return them
      // to the UI so we can show a proper message.
      if (exportRequest && isExportRequestOutdated(exportRequest)) {
        await wallet.cancelMnemonicExport();
      }

      return {
        ...request,
        result: exportRequest,
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };
}
