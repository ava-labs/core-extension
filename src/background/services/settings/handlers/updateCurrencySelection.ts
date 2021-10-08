import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { SettingsState } from '../models';
import { settings$ } from '../settings';
import { saveSettingsToStorage } from '../storage';

export async function settingsUpdateCurrencySelection(
  request: ExtensionConnectionMessage
) {
  const [currency] = request.params || [];

  if (!currency) {
    return {
      ...request,
      error: 'currency undefined or malformed',
    };
  }

  const settings = await firstValueFrom(settings$);

  const newSettings: SettingsState = { ...settings, currency };

  await saveSettingsToStorage(newSettings);

  settings$.next(newSettings);

  return {
    ...request,
    result: true,
  };
}

export const SettingsUpdateCurrencySelectionRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.SETTINGS_UPDATE_CURRENCY,
  settingsUpdateCurrencySelection,
];
