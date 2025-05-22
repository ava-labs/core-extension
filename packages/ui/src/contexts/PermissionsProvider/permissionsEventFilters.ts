import {
  ExtensionConnectionEvent,
  PermissionEvents,
  Permissions,
} from '@core/types';

export function permissionsUpdatedEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<Permissions> {
  return evt.name === PermissionEvents.PERMISSIONS_STATE_UPDATE;
}
