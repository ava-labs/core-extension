import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_CORE_ASSISTANT,
  boolean,
  [state: boolean]
>;

@injectable()
export class SetCoreAssistantHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_CORE_ASSISTANT as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [state] = request.params || [];
    await this.settingsService.setCoreAssistant(state);

    return {
      ...request,
      result: state,
    };
  };
}
