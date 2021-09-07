import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom, map } from 'rxjs';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '../../../connections/models';
import { wallet$ } from '@avalabs/wallet-react-components';
import { pendingMessages } from '../messages';
import { messageParser } from '../utils/messageParser';
import { signMessageTx } from '../utils/signMessageTx';

async function signMessage(request: ExtensionConnectionMessage) {
  const params = request.params;
  const messageId = params && params[0];

  if (!messageId) {
    return {
      ...request,
      error: new Error('no message id in params'),
    };
  }

  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...request,
      error: new Error('no wallet to sign message with'),
    };
  }

  const message = await firstValueFrom(
    pendingMessages.pipe(map((pending) => pending[messageId]))
  ).then(messageParser);

  if (!message) {
    return {
      ...request,
      error: new Error('no message by that id found'),
    };
  }

  const [result, error] = await resolve(signMessageTx(message, walletResult));

  return {
    ...request,
    ...(error ? { error } : { result }),
  };
}

export const SignMessageRequest: [ExtensionRequest, ConnectionRequestHandler] =
  [ExtensionRequest.MESSAGE_SIGN, signMessage];
