import { LedgerWallet } from '@avalabs/avalanche-wallet-sdk';
import { ledgerTransport$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom } from 'rxjs';

export async function getPublicKey(request: ExtensionConnectionMessage) {
  const transport = await firstValueFrom(ledgerTransport$);

  if (!transport) {
    return {
      ...request,
      error:
        'Could not get transport to derive public key, undefined or malformed',
    };
  }

  const [pubKey, pubKeyError] = await resolve(
    LedgerWallet.getExtendedPublicKeyEthAccount(transport)
  );

  if (pubKeyError) {
    if (pubKeyError.message === 'The device was disconnected.') {
      ledgerTransport$.next(null);
    }

    return {
      ...request,
      error: `Error trying to derive public key: ${pubKeyError.message}`,
    };
  }

  if (!pubKey) {
    return {
      ...request,
      error:
        'Public key could not be derived, transport may have been disconnected or locked',
    };
  }

  return {
    ...request,
    result: pubKey,
  };
}

export const GetPublicKeyRequest: [ExtensionRequest, ConnectionRequestHandler] =
  [ExtensionRequest.LEDGER_GET_PUBLIC, getPublicKey];
