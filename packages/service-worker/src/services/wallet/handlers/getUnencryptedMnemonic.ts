import {
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretType,
} from '@core/types';
import { injectable } from 'tsyringe';
import { LockService } from '../../lock/LockService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC,
  string,
  [password: string]
>;

@injectable()
export class GetUnencryptedMnemonicHandler implements HandlerType {
  method = ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC as const;

  constructor(
    private secretsService: SecretsService,
    private lockService: LockService,
    private accountsService: AccountsService,
  ) {}
  handle: HandlerType['handle'] = async ({ request }) => {
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

    if (!this.accountsService.activeAccount) {
      return {
        ...request,
        error: 'there is no active account',
      };
    }
    const secrets = await this.secretsService.getAccountSecrets(
      this.accountsService.activeAccount,
    );

    if (secrets.secretType !== SecretType.Mnemonic) {
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
