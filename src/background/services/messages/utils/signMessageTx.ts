import { WalletType } from '@avalabs/avalanche-wallet-sdk';
import { Message, MessageType } from '../models';

export const signMessageTx = async (
  message: Message,
  wallet: WalletType
): Promise<string> => {
  if (!wallet || wallet.type === 'ledger') {
    throw new Error(
      wallet
        ? `this function not supported on ${wallet.type} wallet`
        : 'wallet undefined in sign tx'
    );
  }
  if (message) {
    switch (message.method) {
      case MessageType.ETH_SIGN:
      case MessageType.PERSONAL_SIGN:
        return await wallet.personalSign(message.displayData.data);
      case MessageType.SIGN_TYPED_DATA:
      case MessageType.SIGN_TYPED_DATA_V1:
        return await wallet.signTypedData_V1(message.displayData.data);
      case MessageType.SIGN_TYPED_DATA_V3:
        return await wallet.signTypedData_V3(message.displayData.data);
      case MessageType.SIGN_TYPED_DATA_V4:
        return await wallet.signTypedData_V4(message.displayData.data);
    }
    throw new Error('unknown method');
  } else {
    throw new Error('no message to sign');
  }
};
