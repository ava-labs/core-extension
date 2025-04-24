import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { ThemeVariant } from '@core/types/src/models';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_UPDATE_THEME,
  true,
  [theme: ThemeVariant]
>;

@injectable()
export class UpdateThemeHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_UPDATE_THEME as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [theme] = request.params || [ThemeVariant.DARK];

    await this.settingsService.setTheme(theme);

    return {
      ...request,
      result: true,
    };
  };
}
