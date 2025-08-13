import {
  ColorTheme,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_UPDATE_THEME,
  true,
  [theme: ColorTheme]
>;

@injectable()
export class UpdateThemeHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_UPDATE_THEME as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [theme] = request.params || ['dark'];

    await this.settingsService.setTheme(theme);

    return {
      ...request,
      result: true,
    };
  };
}
