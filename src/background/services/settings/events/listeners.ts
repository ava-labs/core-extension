import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { SettingsState } from '../models';
import { SettingsEvents } from '../models';

export function settingsUpdatedEventListener(
  evt: ExtensionConnectionEvent<SettingsState>,
) {
  return evt.name === SettingsEvents.SETTINGS_UPDATED;
}
