import { ExtensionConnectionEvent } from '../../../connections/models';
import { SettingsEvents, SettingsState } from '@core/types/src/models';

export function settingsUpdatedEventListener(
  evt: ExtensionConnectionEvent<SettingsState>,
) {
  return evt.name === SettingsEvents.SETTINGS_UPDATED;
}
