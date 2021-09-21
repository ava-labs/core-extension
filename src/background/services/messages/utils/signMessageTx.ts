import {
  personalSign,
  signTypedData_v4,
  signTypedData,
  signTypedMessage,
  signTypedDataLegacy,
} from 'eth-sig-util';
import { MnemonicWallet, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { SignedMessageResult } from '../models';

export const signMessageTx = async (
  message: {
    type: string;
    params?: any;
    data?: string;
    requestId?: string;
    id?: any;
  },
  wallet: WalletType
): Promise<SignedMessageResult> => {
  const privateKey = await (!!wallet && wallet.type !== 'ledger'
    ? (wallet as MnemonicWallet).getEvmPrivateKeyHex()
    : Promise.reject(
        wallet
          ? `this function not supported on ${wallet.type} wallet`
          : 'wallet undefined in sign tx'
      ));

  if (privateKey) {
    const buffer = Buffer.from(privateKey, 'hex');

    if (message) {
      let signed;
      if (message.type === 'personal_sign') {
        signed = personalSign(buffer, message.params);
      } else if (message.type === 'eth_sign' && message.data) {
        signed = signTypedDataLegacy(buffer, { data: message.data });
      } else if (message.type === 'signTypedData_v4' && message.data) {
        const MsgParams = { data: message.data };
        signed = signTypedData_v4(buffer, MsgParams);
      } else if (message.type === 'signTypedData_v3' && message.data) {
        const MsgParams = { data: message.data };
        signed = signTypedData(buffer, MsgParams);
      } else if (
        message.type === 'signTypedData' ||
        (message.type === 'signTypedData_v1' && message.data)
      ) {
        const MsgParams = { data: message.data as string };
        signed = signTypedMessage(buffer, MsgParams, 'V1');
      }

      return {
        status: 'signed',
        id: message.requestId || message.id,
        result: signed,
      };
    } else {
      throw new Error('no message to sign');
    }
  } else {
    throw new Error('no private key to sign with');
  }
};
