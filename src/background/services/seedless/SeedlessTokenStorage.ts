import { SessionStorage, SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import { SecretType } from '../secrets/models';
import { SecretsService } from '../secrets/SecretsService';

export class SeedlessTokenStorage implements SessionStorage<SignerSessionData> {
  constructor(private secretsService: SecretsService) {}

  async save(seedlessSignerToken: SignerSessionData): Promise<void> {
    await this.secretsService.updateSecrets({ seedlessSignerToken });
  }

  async retrieve(): Promise<SignerSessionData> {
    const secrets = await this.secretsService.getActiveAccountSecrets();

    if (secrets.type !== SecretType.Seedless) {
      throw new Error('Incorrect secrets format found');
    }

    return secrets.seedlessSignerToken;
  }
}
