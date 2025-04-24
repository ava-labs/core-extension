import { ExtensionRequest } from '@core/types';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { Languages } from '@core/types';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_LANGUAGE,
  true,
  [language: Languages]
>;

@injectable()
export class SetLanguageHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_LANGUAGE as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [language] = request.params || Languages.EN;

    await this.settingsService.setLanguage(language);

    return {
      ...request,
      result: true,
    };
  };
}
