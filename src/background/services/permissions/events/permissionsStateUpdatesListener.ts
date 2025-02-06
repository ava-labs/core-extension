import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { PermissionEvents, Permissions } from '../models';

export function permissionsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Permissions>,
) {
  return evt.name === PermissionEvents.PERMISSIONS_STATE_UPDATE;
}
