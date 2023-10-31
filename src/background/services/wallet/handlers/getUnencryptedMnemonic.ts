import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LockService } from '../../lock/LockService';
import { SecretType } from '../../secrets/models';
import { SecretsService } from '../../secrets/SecretsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC,
  string,
  [password: string]
>;

@injectable()
export class GetUnencryptedMnemonicHandler implements HandlerType {
  method = ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC as const;

  constructor(
    private secretsService: SecretsService,
    private lockService: LockService
  ) {}
  handle: HandlerType['handle'] = async (request) => {
    const [password] = request.params;

    if (!password) {
      return {
        ...request,
        error: 'password missing for request',
      };
    }

    const validPassword = await this.lockService.verifyPassword(password);

    if (!validPassword) {
      return {
        ...request,
        error: 'Password invalid',
      };
    }

    const secrets = await this.secretsService.getActiveAccountSecrets();

    if (secrets.type !== SecretType.Mnemonic) {
      return {
        ...request,
        error: 'Not a MnemonicWallet',
      };
    }

    return {
      ...request,
      result: secrets.mnemonic,
    };
  };
}
