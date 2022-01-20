import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { SettingsState } from '../models';
import { settings$ } from '../settings';
import { saveSettingsToStorage } from '../storage';

export async function settingsSetDefaultExtension(
  request: ExtensionConnectionMessage
) {
  const settings = await firstValueFrom(settings$);

  const isDefault = !settings.isDefaultExtension;

  const newSettings: SettingsState = {
    ...settings,
    isDefaultExtension: isDefault,
  };

  await saveSettingsToStorage(newSettings);

  settings$.next(newSettings);

  return {
    ...request,
    result: isDefault,
  };
}

export const SettingsSetDefaultExtensionRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.SETTINGS_SET_DEFAULT_EXTENSION,
  settingsSetDefaultExtension,
];
