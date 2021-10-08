import { filter, map, OperatorFunction } from 'rxjs';
import { SettingsState } from '../models';
import { settings$ } from '../settings';
import { SettingsEvents } from './models';

export function settingsUpdatedEvent() {
  return settings$.pipe(
    filter((value) => value !== undefined) as OperatorFunction<
      SettingsState | undefined,
      SettingsState
    >,
    map((value) => ({
      name: SettingsEvents.SETTINGS_UPDATED,
      value,
    }))
  );
}
