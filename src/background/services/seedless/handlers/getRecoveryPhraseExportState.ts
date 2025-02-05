import { injectable } from 'tsyringe';

import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import type { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { SeedlessWallet } from '../SeedlessWallet';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import type { NetworkService } from '../../network/NetworkService';
import type { SeedlessMfaService } from '../SeedlessMfaService';
import type { UserExportInitResponse } from '@cubist-labs/cubesigner-sdk';
import { isExportRequestOutdated } from '../utils';
import type { AccountsService } from '../../accounts/AccountsService';

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
    const secrets = await this.secretsService.getPrimaryAccountSecrets(
      this.accountsService.activeAccount,
    );

    if (secrets?.secretType !== SecretType.Seedless) {
      return {
        ...request,
        result: undefined,
      };
    }

    const wallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretsService),
      addressPublicKey: secrets.pubKeys[0],
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
