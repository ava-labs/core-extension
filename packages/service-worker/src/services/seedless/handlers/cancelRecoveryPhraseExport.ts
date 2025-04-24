import { injectable } from 'tsyringe';

import { ExtensionRequestHandler } from '../../../connections/models';
import { ExtensionRequest } from '@core/types/src/models';

import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { SeedlessWallet } from '../SeedlessWallet';
import { SeedlessTokenStorage } from '../SeedlessTokenStorage';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { AccountsService } from '../../accounts/AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_CANCEL_RECOVERY_PHRASE_EXPORT,
  boolean
>;

@injectable()
export class CancelRecoveryPhraseExportHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_CANCEL_RECOVERY_PHRASE_EXPORT as const;

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
        error: 'Action only available for seedless wallets',
      };
    }

    const wallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretsService),
      addressPublicKey: secrets.publicKeys[0],
      mfaService: this.seedlessMfaService,
    });

    const exportInProgress = await wallet.getMnemonicExportState();

    if (!exportInProgress) {
      return {
        ...request,
        error: 'There are no pending export requests',
      };
    }

    try {
      await wallet.cancelMnemonicExport();

      return {
        ...request,
        result: true,
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };
}
