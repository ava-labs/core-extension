import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  DappRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { settings$ } from '../settings';

export async function settingsGetDefaultExtension(
  request: ExtensionConnectionMessage
) {
  const settings = await firstValueFrom(settings$);

  return {
    ...request,
    result: !!settings.isDefaultExtension,
  };
}

export const SettingsGetIsDefaultExtensionRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.SETTINGS_GET_DEFAULT_EXTENSION,
  settingsGetDefaultExtension,
];

export const SettingsGetIsDefaultExtensionDappRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.GET_IS_DEFAULT_EXTENSION,
  {
    handleUnauthenticated: settingsGetDefaultExtension,
    handleAuthenticated: settingsGetDefaultExtension,
  },
];
