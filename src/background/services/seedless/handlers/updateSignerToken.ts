import { injectable } from 'tsyringe';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import { resolve } from '@src/utils/promiseResolver';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SeedlessSessionManager } from '../SeedlessSessionManager';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
  void,
  [token: SignerSessionData, email: string]
>;

@injectable()
export class UpdateSignerTokenHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN as const;

  constructor(
    private sessionMgr: SeedlessSessionManager,
    private secretsService: SecretsService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const [token, email] = request.params;

    if (!token) {
      return { ...request, error: 'missing token' };
    }

    if (!token.session_info) {
      // One scenario when this can happen if MFA challenge was not completed.
      // Maybe there are other scenarios as well.
      return { ...request, error: 'missing session information' };
    }

    if (!email) {
      return { ...request, error: 'missing email address' };
    }

    const secrets = await this.secretsService.getActiveAccountSecrets();

    if (secrets.type !== SecretType.Seedless) {
      return {
        ...request,
        error: 'action available only for seedless accounts',
      };
    }

    if (email !== secrets.userEmail) {
      return { ...request, error: 'mismatching email address' };
    }

    const [result, error] = await resolve(
      this.sessionMgr.updateSignerToken(token)
    );

    return {
      ...request,
      result: result,
      error: error ? error.message || error.toString() : undefined,
    };
  };
}
