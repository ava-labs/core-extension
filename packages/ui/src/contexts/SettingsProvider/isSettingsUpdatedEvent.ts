import {
  ExtensionConnectionEvent,
  SettingsEvents,
  SettingsState,
} from '@core/types';

export function isSettingsUpdatedEvent(
  evt: ExtensionConnectionEvent<SettingsState>,
) {
  return evt.name === SettingsEvents.SETTINGS_UPDATED;
}
