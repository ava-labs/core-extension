import { SessionStorage, SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import { SecretType } from '../secrets/models';
import { SecretsService } from '../secrets/SecretsService';

export class SeedlessTokenStorage implements SessionStorage<SignerSessionData> {
  constructor(private secretsService: SecretsService) {}

  async save(seedlessSignerToken: SignerSessionData): Promise<void> {
    const secrets = await this.secretsService.getPrimaryAccountSecrets();

    // Prevent writing signer token to a different type of wallet
    if (secrets && secrets.type !== SecretType.Seedless) {
      throw new Error('Incompatible wallet type is initialized');
    }

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
