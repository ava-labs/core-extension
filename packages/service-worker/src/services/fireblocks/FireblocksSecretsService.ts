import { importPKCS8, KeyLike } from 'jose';
import { singleton } from 'tsyringe';

import { SecretType } from '../secrets/models';
import { SecretsService } from '../secrets/SecretsService';

import {
  FireblocksBtcAccessError,
  FireblocksBtcAccessErrorCode,
  FireblocksSecretsProvider,
} from '@core/types/src/models';
import { AccountsService } from '../accounts/AccountsService';

@singleton()
export class FireblocksSecretsService implements FireblocksSecretsProvider {
  constructor(
    private secretsService: SecretsService,
    private accountsService: AccountsService,
  ) {}

  async getSecrets(): Promise<{ apiKey: string; privateKey: KeyLike }> {
    if (!this.accountsService.activeAccount) {
      throw new Error('There is no active account!');
    }
    // By default thought, we'll get the credentials directly from SecretsService
    const secrets = await this.secretsService.getAccountSecrets(
      this.accountsService.activeAccount,
    );

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
