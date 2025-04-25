import { injectable } from 'tsyringe';

import { resolve } from '@core/utils';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  RecoveryMethod,
  SecretType,
} from '@core/types';

import { SecretsService } from '../../secrets/SecretsService';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { AccountsService } from '../../accounts/AccountsService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_GET_RECOVERY_METHODS,
  RecoveryMethod[]
>;

@injectable()
export class GetRecoveryMethodsHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_GET_RECOVERY_METHODS as const;

  constructor(
    private secretsService: SecretsService,
    private seedlessMfaService: SeedlessMfaService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const secrets = await this.secretsService.getPrimaryAccountSecrets(
      this.accountsService.activeAccount,
    );

    if (secrets?.secretType !== SecretType.Seedless) {
      return {
        ...request,
        result: [],
      };
    }

    const [result, error] = await resolve(
      this.seedlessMfaService.getRecoveryMethods(),
    );

    return {
      ...request,
      result: result,
      error: error ? error.message || error.toString() : undefined,
    };
  };
}
