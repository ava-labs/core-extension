import { DomainMetadata } from '@src/background/models';
import { JsonRpcRequest } from '@src/utils/jsonRpcEngine';
import { toLogger } from '@src/utils/logging';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TxStatus } from '../transactions/models';
import { Message, MessageUpdate } from './models';
import { paramsToMessageParams } from './utils/messageParamsParser';

export const pendingMessages$ = new BehaviorSubject<{ [id: string]: Message }>(
  {}
);

export const addMessage$ = new Subject<
  JsonRpcRequest<any> & {
    site: DomainMetadata;
  }
>();

export const updateMessage$ = new Subject<MessageUpdate>();

addMessage$
  .pipe(
    switchMap(async (newMessage) => {
      return Promise.all([
        firstValueFrom(pendingMessages$),
        Promise.resolve(newMessage),
      ]);
    }),
    map(([currentPendingMessages, message]) => {
      const pendingMessage: Message = {
        ...message,
        id: message.id,
        time: new Date().getTime(),
        status: TxStatus.PENDING,
        displayData: paramsToMessageParams(message),
      };

      pendingMessages$.next({
        ...currentPendingMessages,
        [`${message.id}`]: pendingMessage,
      });

      return pendingMessage;
    }),
    toLogger('pending message added')
  )
  .subscribe();

updateMessage$
  .pipe(
    switchMap(async (messageUpdate) => {
      return Promise.all([
        firstValueFrom(pendingMessages$),
        Promise.resolve(messageUpdate),
      ]);
    }),
    map(([currentPendingMessages, { status, id, result, error }]) => {
      if (
        status !== TxStatus.SIGNED &&
        status !== TxStatus.ERROR &&
        status !== TxStatus.ERROR_USER_CANCELED
      ) {
        const pendingMessage = currentPendingMessages[id];
        pendingMessages$.next({
          ...currentPendingMessages,
          [id]: {
            ...pendingMessage,
            status,
            result,
            error,
          },
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [`${id}`]: _removed, ...txs } = currentPendingMessages;
        pendingMessages$.next(txs);
      }
    }),
    toLogger('pending message updated')
  )
  .subscribe();
