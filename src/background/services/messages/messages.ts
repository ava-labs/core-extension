import { JsonRpcRequest } from '@src/background/rpc/jsonRpcEngine';
import storageListener from '@src/utils/storage/local-storage';
import { Subject, Observable, firstValueFrom } from 'rxjs';
import { tap, map, filter, mergeWith } from 'rxjs/operators';
import { IndexAndStoreBase } from '../indexAndStoreBase';
import { Message, MessageType } from './models';

class MessagesService extends IndexAndStoreBase<Message> {
  private paramsToMessageParams(
    data: JsonRpcRequest<any>,
    signType: MessageType
  ) {
    const { params } = data;
    switch (signType) {
      case MessageType.PERSONAL_SIGN:
        return {
          data: params[0],
          from: params[1],
          password: params[2],
        };
      case MessageType.SIGN_TYPED_DATA:
        return {
          data: params[0],
          from: params[1],
        };
      case MessageType.ETH_SIGN:
        return {
          data: params[0],
          from: params[1],
        };
      default:
        return {
          from: params[0],
          data: params[1],
        };
    }
  }

  saveMessage(data: JsonRpcRequest<any>, signType: MessageType) {
    const now = new Date().getTime();
    this.save({
      id: data.id,
      time: now,
      status: 'unsigned',
      msgParams: this.paramsToMessageParams(data, signType),
      type: signType,
    });

    return {
      listenForUpdates: (cancel: Observable<any>) => {
        return this.listenForMessageUpdate(data.id as string, cancel);
      },
    };
  }

  updateMessage({
    status,
    id,
    result,
  }: {
    status: string;
    id: Message['id'];
    result: any;
  }) {
    const pendingMessage = this.getById(id);
    if (pendingMessage) {
      this.update({
        ...pendingMessage,
        status,
        result,
      });
    } else {
      console.error('error when trying to update a pending message');
    }
  }

  listenForMessageUpdate(id: string, cancled: Observable<any>) {
    return firstValueFrom(
      storageListener.pipe(
        map(() => this.getById(id)?.result),
        filter((result) => !!result),
        mergeWith(cancled)
      )
    );
  }
}

export const messageService = new MessagesService('pending-messages');
