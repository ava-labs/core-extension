import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { SettingsState } from '../models';
import { settings$ } from '../settings';
import { saveSettingsToStorage } from '../storage';

export async function settingsUpdateTokensVisibility(
  request: ExtensionConnectionMessage
) {
  const [tokensVisibility] = request.params || [];

  const settings = await firstValueFrom(settings$);

  const newSettings: SettingsState = {
    ...settings,
    tokensVisibility,
  };

  await saveSettingsToStorage(newSettings);

  settings$.next(newSettings);

  return {
    ...request,
    result: true,
  };
}

export const SettingsUpdateTokensVisibility: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.SETTINGS_UPDATE_TOKENS_VISIBILITY,
  settingsUpdateTokensVisibility,
];
