import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ThemeVariant } from '../models';
import type { SettingsService } from '../SettingsService';

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
