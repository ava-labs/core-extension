import { importPKCS8, KeyLike } from 'jose';
import { singleton } from 'tsyringe';

import { SecretType } from '../secrets/models';
import { SecretsService } from '../secrets/SecretsService';

import {
  FireblocksBtcAccessError,
  FireblocksBtcAccessErrorCode,
  FireblocksSecretsProvider,
} from './models';

@singleton()
export class FireblocksSecretsService implements FireblocksSecretsProvider {
  constructor(private secretsService: SecretsService) {}

  async getSecrets(): Promise<{ apiKey: string; privateKey: KeyLike }> {
    // By default thought, we'll get the credentials directly from SecretsService
    const secrets = await this.secretsService.getActiveAccountSecrets();

    if (secrets.type !== SecretType.Fireblocks) {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.WrongAccountType
      );
    }

    if (!secrets.api) {
      throw new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.SecretsNotConfigured
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
        FireblocksBtcAccessErrorCode.InvalidSecretKey
      );
    }
  }
}
