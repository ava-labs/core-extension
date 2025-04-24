import { injectable } from 'tsyringe';
import { TotpChallenge } from '@cubist-labs/cubesigner-sdk';

import { ExtensionRequestHandler } from '../../../connections/models';
import { ExtensionRequest } from '@core/types/src/models';

import { SeedlessMfaService } from '../SeedlessMfaService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_INIT_AUTHENTICATOR_CHANGE,
  Pick<TotpChallenge, 'totpId' | 'totpUrl'>
>;

@injectable()
export class InitAuthenticatorChangeHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_INIT_AUTHENTICATOR_CHANGE as const;

  constructor(private seedlessMfaService: SeedlessMfaService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      return {
        ...request,
        result: await this.seedlessMfaService.initAuthenticatorChange(
          request.tabId,
        ),
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err.toString(),
      };
    }
  };
}
