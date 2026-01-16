import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_PRIVACY_MODE,
  true,
  [boolean]
>;

@injectable()
export class SetPrivacyModeHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_PRIVACY_MODE as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [enabled] = request.params || [false];
    await this.settingsService.setPrivacyMode(enabled);

    return {
      ...request,
      result: true,
    };
  };
}
