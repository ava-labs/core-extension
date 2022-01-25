import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { decryptPhraseOrKeyInStorage } from '../storage';

export async function getUnencryptedMnemonic(
  request: ExtensionConnectionMessage
) {
  const [password] = request.params || [];

  if (!password) {
    return {
      ...request,
      error: 'password missing for request',
    };
  }

  const [decryptedMnemonic, err] = await resolve(
    decryptPhraseOrKeyInStorage(password)
  );

  if (err) {
    return {
      ...request,
      error: err.toString(),
    };
  }

  return {
    ...request,
    result: decryptedMnemonic,
  };
}

export const GetUnencryptedMnemonicRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC, getUnencryptedMnemonic];
