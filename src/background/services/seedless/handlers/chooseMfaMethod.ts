import { injectable } from 'tsyringe';

import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import type { MfaChoiceResponse } from '../models';
import type { SeedlessMfaService } from '../SeedlessMfaService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_CHOOSE_MFA_METHOD,
  true,
  [response: MfaChoiceResponse]
>;

@injectable()
export class ChooseMfaMethodHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_CHOOSE_MFA_METHOD as const;

  constructor(private seedlessMfaService: SeedlessMfaService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [response] = request.params;

    if (!response) {
      return { ...request, error: 'MFA method response is required' };
    }

    if (!response.mfaId) {
      return { ...request, error: 'unspecified MFA challenge id' };
    }

    if (!response.chosenMethod) {
      return { ...request, error: 'MFA method choice is required' };
    }

    await this.seedlessMfaService.submitChosenMethod(response, request.tabId);

    return {
      ...request,
      result: true,
    };
  };
}
