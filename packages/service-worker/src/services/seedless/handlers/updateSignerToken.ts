import { injectable } from 'tsyringe';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import { resolve } from '@core/utils';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretType,
} from '@core/types';

import { SeedlessSessionManager } from '../SeedlessSessionManager';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
  void,
  [token: SignerSessionData, email: string | undefined, userId: string]
>;

@injectable()
export class UpdateSignerTokenHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN as const;

  constructor(
    private sessionMgr: SeedlessSessionManager,
    private secretsService: SecretsService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [token, email, userId] = request.params;

    if (!token) {
      return { ...request, error: 'missing token' };
    }

    if (!token.session_info) {
      // One scenario when this can happen if MFA challenge was not completed.
      // Maybe there are other scenarios as well.
      return { ...request, error: 'missing session information' };
    }

    if (!userId) {
      return { ...request, error: 'missing user ID' };
    }
    if (!this.accountsService.activeAccount) {
      return { ...request, error: 'missing active account' };
    }

    const secrets = await this.secretsService.getAccountSecrets(
      this.accountsService.activeAccount,
    );

    if (secrets.secretType !== SecretType.Seedless) {
      return {
        ...request,
        error: 'action available only for seedless accounts',
      };
    }

    // Primary way to check the identity of the user is checking if userIds match
    if (secrets.userId && userId !== secrets.userId) {
      return { ...request, error: 'mismatching user ID' };
    }

    // Since older seedless secrets do not have userId, we check if emails match
    if (!secrets.userId && email !== secrets.userEmail) {
      return { ...request, error: 'mismatching email address' };
    }

    // Update secrets when current seedless secrets is missing userId.
    // We set userEmail to undefined and in the near future, we will deprecate it
    if (!secrets.userId && email === secrets.userEmail) {
      await this.secretsService.updateSecrets(
        { ...secrets, userId, userEmail: undefined },
        secrets.id,
      );
    }

    const [result, error] = await resolve(
      this.sessionMgr.updateSignerToken(token),
    );

    return {
      ...request,
      result: result,
      error: error ? error.message || error.toString() : undefined,
    };
  };
}
