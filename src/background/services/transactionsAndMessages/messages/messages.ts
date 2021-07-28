import { JsonRpcRequest } from '@src/background/rpc/jsonRpcEngine';
import { TransactionsAndMessagesBase } from '../txAndMessagesBase';
import { Message, MessageType } from './models';

class MessagesService extends TransactionsAndMessagesBase<Message> {
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
}

export default new MessagesService('MESSAGES');
