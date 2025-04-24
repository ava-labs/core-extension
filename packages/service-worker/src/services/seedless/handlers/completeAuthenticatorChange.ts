import { injectable } from 'tsyringe';

import { ExtensionRequestHandler } from '../../../connections/models';
import { ExtensionRequest } from '@core/types/src/models';

import { SeedlessMfaService } from '../SeedlessMfaService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_COMPLETE_AUTHENTICATOR_CHANGE,
  void,
  [totpId: string, code: string]
>;

@injectable()
export class CompleteAuthenticatorChangeHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_COMPLETE_AUTHENTICATOR_CHANGE as const;

  constructor(private seedlessMfaService: SeedlessMfaService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [totpId, code] = request.params;

    try {
      return {
        ...request,
        result: await this.seedlessMfaService.completeAuthenticatorChange(
          totpId,
          code,
        ),
      };
    } catch (error: any) {
      return {
        ...request,
        error: error instanceof Error ? error.message : error.toString(),
      };
    }
  };
}
