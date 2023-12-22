import { injectable } from 'tsyringe';

import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { MfaResponseData } from '../models';
import { SeedlessMfaService } from '../SeedlessMfaService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
  true,
  [response: MfaResponseData]
>;

@injectable()
export class SubmitMfaResponseHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE as const;

  constructor(private seedlessMfaService: SeedlessMfaService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [response] = request.params;

    if (!response) {
      return { ...request, error: 'MFA response is required' };
    }

    if (!response.mfaId) {
      return { ...request, error: 'unspecified MFA challenge id' };
    }

    if (!response.code && !response.answer) {
      return { ...request, error: 'TOTP code or FIDO answer is required' };
    }

    await this.seedlessMfaService.submitMfaResponse(response);

    return {
      ...request,
      result: true,
    };
  };
}
