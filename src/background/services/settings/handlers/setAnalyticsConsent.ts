import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { SettingsState } from '../models';
import { settings$ } from '../settings';
import { saveSettingsToStorage } from '../storage';

export async function settingsSetAnalyticsConsent(consent: boolean) {
  const settings = await firstValueFrom(settings$);
  const newSettings: SettingsState = {
    ...settings,
    analyticsConsent: !!consent,
  };

  await saveSettingsToStorage(newSettings);

  settings$.next(newSettings);
}

async function settingsSetAnalyticsConsentHandler(
  request: ExtensionConnectionMessage
) {
  const [consent] = request.params || [];
  settingsSetAnalyticsConsent(!!consent);

  return {
    ...request,
    result: consent,
  };
}

export const SettingsSetAnalyticsConsentRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.SETTINGS_SET_ANALYTICS_CONSENT,
  settingsSetAnalyticsConsentHandler,
];
