import { JsonRpcRequest } from '@src/utils/jsonRpcEngine';
import { toLogger } from '@src/utils/logging';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Message, MessageType } from './models';
import { paramsToMessageParams } from './utils/messageParamsParser';

export const messages = new BehaviorSubject<Message[]>([]);

export const pendingMessages = new BehaviorSubject<{ [id: string]: Message }>(
  {}
);

export const addMessage = new Subject<{
  data: JsonRpcRequest<any>;
  signType: MessageType;
}>();

export const updateMessage = new Subject<{
  status: string;
  id: Message['id'];
  result: any;
}>();

addMessage
  .pipe(
    switchMap(async (newMessage) => {
      return Promise.all([
        firstValueFrom(pendingMessages),
        Promise.resolve(newMessage),
      ]);
    }),
    map(([currentPendingMessages, { data, signType }]) => {
      const pendingMessage = {
        id: data.id,
        time: new Date().getTime(),
        status: 'unsigned',
        msgParams: paramsToMessageParams(data, signType),
        type: signType,
      };

      pendingMessages.next({
        ...currentPendingMessages,
        [`${data.id}`]: pendingMessage,
      });

      return pendingMessage;
    }),
    toLogger('pending message added')
  )
  .subscribe();

updateMessage
  .pipe(
    switchMap(async (messageUpdate) => {
      return Promise.all([
        firstValueFrom(messages),
        firstValueFrom(pendingMessages),
        Promise.resolve(messageUpdate),
      ]);
    }),
    map(([currentMessages, currentPendingMessages, { status, id, result }]) => {
      const pendingMessage = currentPendingMessages[id as string];
      if (pendingMessage) {
        const updatedMessage = {
          ...pendingMessage,
          status,
          result,
        };

        messages.next([...currentMessages, updatedMessage]);

        return updatedMessage;
      }
    }),
    toLogger('pending message updated')
  )
  .subscribe();
