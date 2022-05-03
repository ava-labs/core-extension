import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ThemeVariant } from '../models';
import { SettingsService } from '../SettingsService';

@injectable()
export class UpdateThemeHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_UPDATE_THEME];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [theme] = request.params || [ThemeVariant.DARK];

    await this.settingsService.setTheme(theme);

    return {
      ...request,
      result: true,
    };
  };
}
