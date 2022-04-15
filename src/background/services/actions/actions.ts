import { DomainMetadata } from '@src/background/models';
import { JsonRpcRequest } from '@src/utils/jsonRpcEngine';
import { toLogger } from '@src/utils/logging';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Action as Action,
  ActionStatus,
  ActionUpdate as ActionUpdate,
} from './models';

/*
actions are generic busses for background script to popup and get user input before proceeding. See signMessage or bridge transfer asset for examples
*/

export const pendingActions$ = new BehaviorSubject<{ [id: string]: Action }>(
  {}
);

export const addAction$ = new Subject<
  JsonRpcRequest<any> & {
    site: DomainMetadata;
    displayData: any;
  }
>();

export const updateAction$ = new Subject<ActionUpdate>();

addAction$
  .pipe(
    switchMap(async (newAction) => {
      return Promise.all([
        firstValueFrom(pendingActions$),
        Promise.resolve(newAction),
      ]);
    }),
    map(([currentPendingAction, action]) => {
      const pendingAction: Action = {
        ...action,
        time: new Date().getTime(),
        status: ActionStatus.PENDING,
      };

      pendingActions$.next({
        ...currentPendingAction,
        [`${action.id}`]: pendingAction,
      });

      return pendingAction;
    }),
    toLogger('pending action added')
  )
  .subscribe();

updateAction$
  .pipe(
    switchMap(async (actionUpdate) => {
      return Promise.all([
        firstValueFrom(pendingActions$),
        Promise.resolve(actionUpdate),
      ]);
    }),
    map(([currentPendingActions, { status, id, result, error }]) => {
      if (
        status !== ActionStatus.COMPLETED &&
        status !== ActionStatus.ERROR &&
        status !== ActionStatus.ERROR_USER_CANCELED
      ) {
        const pendingMessage = currentPendingActions[id];
        pendingActions$.next({
          ...currentPendingActions,
          [id]: {
            ...pendingMessage,
            status,
            result,
            error,
          },
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [`${id}`]: _removed, ...txs } = currentPendingActions;
        pendingActions$.next(txs);
      }
    }),
    toLogger('pending message updated')
  )
  .subscribe();
