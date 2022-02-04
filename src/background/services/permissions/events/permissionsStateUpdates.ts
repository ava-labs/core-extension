import { map } from 'rxjs';
import { permissions$ } from '../permissions';
import { PermissionEvents } from './models';

export const permissionsUpdateEvents = permissions$.pipe(
  map((permissions) => {
    return {
      name: PermissionEvents.PERMISSIONS_STATE_UPDATE,
      value: permissions,
    };
  })
);
