import {
  Subject,
  tap,
  firstValueFrom,
  BehaviorSubject,
  switchMap,
  filter,
  mergeMap,
} from 'rxjs';
import { storageKey$ } from '../wallet/storageKey';
import { DappPermissions, Permissions } from './models';
import { getPermissionsFromStorage, savePermissionsToStorage } from './storage';

export const permissions$ = new BehaviorSubject<Permissions>({});

storageKey$
  .pipe(
    filter((ready) => !!ready),
    mergeMap(() => getPermissionsFromStorage())
  )
  .subscribe((values) => {
    permissions$.next(values);
  });

export const addPermissionsForDomain = new Subject<DappPermissions>();

addPermissionsForDomain
  .pipe(
    switchMap(async (dappPermissions) => {
      return Promise.all([
        firstValueFrom(permissions$),
        Promise.resolve(dappPermissions),
      ]);
    }),
    tap(([currentPermissions, dappPermissions]) => {
      permissions$.next({
        ...currentPermissions,
        [dappPermissions.domain]: dappPermissions,
      });
    }),
    tap(async () => {
      const currentPermissions = await firstValueFrom(permissions$);
      savePermissionsToStorage(currentPermissions);
    })
  )
  .subscribe();
