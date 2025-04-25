import { injectable } from 'tsyringe';

import {
  ExtensionRequest,
  ExtensionRequestHandler,
  MfaChoiceResponse,
} from '@core/types';

import { SeedlessMfaService } from '../SeedlessMfaService';

export type HandlerType = ExtensionRequestHandler<
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
