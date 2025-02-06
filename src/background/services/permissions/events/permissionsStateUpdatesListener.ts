import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { Permissions } from '../models';
import { PermissionEvents } from '../models';

export function permissionsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Permissions>,
) {
  return evt.name === PermissionEvents.PERMISSIONS_STATE_UPDATE;
}
