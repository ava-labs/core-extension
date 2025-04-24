import { ExtensionConnectionEvent } from '../../../connections/models';
import { PermissionEvents, Permissions } from '@core/types/src/models';

export function permissionsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Permissions>,
) {
  return evt.name === PermissionEvents.PERMISSIONS_STATE_UPDATE;
}
