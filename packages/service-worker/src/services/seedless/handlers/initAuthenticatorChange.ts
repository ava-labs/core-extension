import { injectable } from 'tsyringe';
import { TotpChallenge } from '@cubist-labs/cubesigner-sdk';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { SeedlessMfaService } from '../SeedlessMfaService';

export type HandlerType = ExtensionRequestHandler<
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
