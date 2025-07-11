import { importPKCS8, KeyLike } from 'jose';
import { singleton } from 'tsyringe';

import { AccountsService } from '~/services/accounts/AccountsService';
import { SecretsService } from '~/services/secrets/SecretsService';
import {
  FireblocksBtcAccessError,
  FireblocksBtcAccessErrorCode,
  SecretType,
} from '@core/types';
import { FireblocksSecretsProvider } from './models';

@singleton()
export class FireblocksSecretsService extends FireblocksSecretsProvider {
  constructor(
    private secretsService: SecretsService,
    private accountsService: AccountsService,
  ) {
    super();
  }

  async getSecrets(): Promise<{ apiKey: string; privateKey: KeyLike }> {
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount) {
      throw new Error('There is no active account!');
    }
    // By default thought, we'll get the credentials directly from SecretsService
    const secrets = await this.secretsService.getAccountSecrets(activeAccount);

    if (secrets.secretType !== SecretType.Fireblocks) {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.WrongAccountType,
      );
    }

    if (!secrets.api) {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.SecretsNotConfigured,
      );
    }

    try {
      const privateKey = await importPKCS8(secrets.api.secret, 'RS256');

      return {
        apiKey: secrets.api.key,
        privateKey,
      };
    } catch {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.InvalidSecretKey,
      );
    }
  }
}
