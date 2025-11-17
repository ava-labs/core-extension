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
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount) {
      throw new Error('There is no active account');
    }
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
