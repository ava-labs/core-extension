import {
  ExtensionConnectionEvent,
  PermissionEvents,
  Permissions,
} from '@core/types';

export function permissionsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Permissions>,
) {
  return evt.name === PermissionEvents.PERMISSIONS_STATE_UPDATE;
}
