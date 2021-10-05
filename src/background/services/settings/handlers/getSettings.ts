import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { settings$ } from '../settings';

export async function getSettings(request: ExtensionConnectionMessage) {
  const settings = await firstValueFrom(settings$);

  return {
    ...request,
    result: settings ?? {},
  };
}

export const GetSettingsStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SETTINGS_GET, getSettings];
