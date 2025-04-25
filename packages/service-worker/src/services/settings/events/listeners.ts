import {
  ExtensionConnectionEvent,
  SettingsEvents,
  SettingsState,
} from '@core/types';

export function settingsUpdatedEventListener(
  evt: ExtensionConnectionEvent<SettingsState>,
) {
  return evt.name === SettingsEvents.SETTINGS_UPDATED;
}
