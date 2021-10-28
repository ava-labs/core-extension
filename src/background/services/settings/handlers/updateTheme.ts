import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { SettingsState, ThemeVariant } from '../models';
import { settings$ } from '../settings';
import { saveSettingsToStorage } from '../storage';

export async function settingsUpdateTheme(
  request: ExtensionConnectionMessage<ThemeVariant>
) {
  const [theme] = request.params || [ThemeVariant.DARK];

  const settings = await firstValueFrom(settings$);

  const newSettings: SettingsState = {
    ...settings,
    theme: theme,
  };

  await saveSettingsToStorage(newSettings);

  settings$.next(newSettings);

  return {
    ...request,
    result: true,
  };
}

export const SettingsUpdateThemeRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SETTINGS_UPDATE_THEME, settingsUpdateTheme];
