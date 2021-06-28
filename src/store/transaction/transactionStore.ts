import { makeAutoObservable, autorun, observable, configure } from 'mobx';
import { persistStore } from '@src/utils/mobx';
import store from 'store';
import {
  UnapprovedTransaction,
  UnapprovedMessage,
  txParams,
  MessageType,
} from './types';
import { JsonRpcRequest } from 'json-rpc-engine';
import { removeTypeDuplicates } from '@babel/types';
import { Signal } from 'micro-signals';
import { getStoreFromStorage } from '@src/background/utils/storage';
import { normalize } from 'eth-sig-util';
import { stripHexPrefix } from 'ethereumjs-util';
import { Utils } from '@avalabs/avalanche-wallet-sdk';

const getTransactionOrMessageId = (id: UnapprovedTransaction['id']) => {
  return `${id}`;
};

const transactionFinalizedEvent = new Signal();
const messageFinalizedEvent = new Signal();

class TransactionStore {
  addrX: string = '';

  transactions: { [key: string]: UnapprovedTransaction } = {};
  _messages: { [key: string]: UnapprovedMessage } = {};
  get messages() {
    const transactionStore = getStoreFromStorage('TransactionStore');
    const messages = transactionStore._messages;
    return messages;
  }
  set messages(mess: any) {
    this._messages = mess;
  }

  transactionFinalizedEvent = transactionFinalizedEvent;
  messageFinalizedEvent = messageFinalizedEvent;

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['transactions', '_messages'], 'TransactionStore');
  }

  getUnnapprovedTxById(
    id: UnapprovedTransaction['id']
  ): UnapprovedTransaction | undefined {
    return this.transactions[getTransactionOrMessageId(id)];
  }

  getUnnaprovedMsgById(
    id: UnapprovedMessage['id']
  ): UnapprovedMessage | undefined {
    return this.messages[getTransactionOrMessageId(id)];
  }

  removeUnapprovedTransaction(id: string | number) {
    const { [getTransactionOrMessageId(id)]: _removed, ...remaining } =
      this.transactions;
    this.transactions = remaining;
  }

  removeUnapprovedMessage(id: string | number) {
    const { [getTransactionOrMessageId(id)]: _removed, ...remaining } =
      this.messages;
    this.messages = remaining;
  }

  async saveUnapprovedTx(data: JsonRpcRequest<any>, from: string) {
    const { params } = data;
    let { to, value, gas, gasPrice }: txParams = params;
    const now = new Date().getTime();

    let sampleTx = {
      id: data.id,
      time: now,
      status: 'string',
      metamaskNetworkId: '1',
      chainId: '0xa869',
      txParams: {
        from: from,
        to: to,
        value: value,
        gas: gas,
        gasPrice: gasPrice,
      },
      type: 'standard',
      transactionCategory: 'transfer',
    };

    this.transactions = {
      ...this.transactions,
      [getTransactionOrMessageId(sampleTx.id)]: sampleTx,
    };
    return;
  }

  async saveUnapprovedMsg(
    data: JsonRpcRequest<any>,
    from: string,
    signType: MessageType
  ) {
    const { params } = data;

    const now = new Date().getTime();

    let msgData: UnapprovedMessage = {
      id: data.id,
      from,
      time: now,
      status: 'unsigned',
      msgParams: params[1],
      type: signType,
    };

    this.messages = {
      ...this.messages,
      [getTransactionOrMessageId(msgData.id)]: msgData,
    };

    return;
  }

  async updateUnapprovedMsg({ status, id, result }) {
    const messId = getTransactionOrMessageId(id);
    const message = this.messages[messId];
    this.messages = {
      ...this.messages,
      [messId]: {
        ...message,
        status,
        result,
      } as UnapprovedMessage,
    };
  }

  async updateUnapprovedTransaction({ status, id, result }) {
    const txId = getTransactionOrMessageId(id);
    const transaction = this.transactions[txId];
    this.transactions = {
      ...this.transactions,
      [txId]: {
        ...transaction,
        status,
        txHash: result,
      } as UnapprovedTransaction,
    };
  }

  async decryptSignedData({ msgParams }) {
    const address = normalize(msgParams.from);
  }

  validateParams(msgData) {
    const { msgParams } = msgData;
    const isValid = typeof Utils.isValidAddress(msgParams.from) === 'boolean';

    if (!isValid) {
      return '"from" field must be a valid, lowercase, hexadecimal Ethereum address string.';
    }

    if (msgParams && typeof msgParams !== 'object') {
      return 'msgParams must be an object.';
    }
    if (msgParams.data === undefined) {
      return 'msgParams must include a "data" field.';
    }

    if (msgParams.from === undefined) {
      return 'msgParams must include a "from" field.';
    }

    switch (msgData.type) {
      case 'signTypedData_v1':
        if (!Array.isArray(msgParams.data)) {
          return '"msgParams.data" must be an array.';
        }
        break;
      case 'signTypedData_v3':
      case 'signTypedData_v4': {
        if (typeof msgParams.data !== 'string') {
          return '"msgParams.data" must be a string.';
        }

        const { chainId } = msgParams.data.domain;
        if (chainId) {
          // validate chain id
          return `Cannot sign message for ${chainId} while switching networks.`;
        }
      }
      default:
        return `Unknown typed data version "${msgParams.type}"`;
    }
  }
}

export default TransactionStore;
