import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { SettingsState } from '../models';
import { settings$ } from '../settings';
import { saveSettingsToStorage } from '../storage';

export async function settingsUpdateShowTokensNoBalance(
  request: ExtensionConnectionMessage
) {
  const [showTokensWithoutBalances] = request.params || [];

  const settings = await firstValueFrom(settings$);

  const newSettings: SettingsState = {
    ...settings,
    showTokensWithoutBalances: !!showTokensWithoutBalances,
  };

  await saveSettingsToStorage(newSettings);

  settings$.next(newSettings);

  return {
    ...request,
    result: true,
  };
}

export const SettingsUpdateShowTokensWithBalanceRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.SETTINGS_UPDATE_SHOW_NO_BALANCE,
  settingsUpdateShowTokensNoBalance,
];
