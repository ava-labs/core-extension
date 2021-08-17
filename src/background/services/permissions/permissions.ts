import { formatAndLog } from '@src/background/utils/logging';
import { Subject, tap, firstValueFrom, BehaviorSubject, switchMap } from 'rxjs';
import { DappPermissions, Permissions } from './models';
import { getPermissionsFromStorage, savePermissionsToStorage } from './storage';

export const permissions = new BehaviorSubject<Permissions>({});

getPermissionsFromStorage().then((values) => {
  permissions.next(values);
});

export const addPermissionsForDomain = new Subject<DappPermissions>();

addPermissionsForDomain
  .pipe(
    switchMap(async (dappPermissions) => {
      return Promise.all([
        firstValueFrom(permissions),
        Promise.resolve(dappPermissions),
      ]);
    }),
    tap(([currentPermissions, dappPermissions]) => {
      permissions.next({
        ...currentPermissions,
        [dappPermissions.domain]: dappPermissions,
      });
    }),
    tap(async () => {
      const currentPermissions = await firstValueFrom(permissions);
      savePermissionsToStorage(currentPermissions);
    })
  )
  .subscribe();

permissions.subscribe((perms) => {
  formatAndLog('permissions updated', perms);
});
