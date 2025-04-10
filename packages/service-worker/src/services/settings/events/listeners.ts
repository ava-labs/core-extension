import { ExtensionConnectionEvent } from '../../../connections/models';
import { SettingsEvents, SettingsState } from '../models';

export function settingsUpdatedEventListener(
  evt: ExtensionConnectionEvent<SettingsState>,
) {
  return evt.name === SettingsEvents.SETTINGS_UPDATED;
}
