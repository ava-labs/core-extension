import { LedgerWallet } from '@avalabs/avalanche-wallet-sdk';
import { ledgerTransport$ } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

@injectable()
export class GetPublicKeyHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.LEDGER_GET_PUBLIC];

  constructor(private ledgerService: LedgerService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    if (!this.ledgerService.transport) {
      return {
        ...request,
        error:
          'Could not get transport to derive public key, undefined or malformed',
      };
    }

    const [pubKey, pubKeyError] = await resolve(
      LedgerWallet.getExtendedPublicKeyEthAccount(this.ledgerService.transport)
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
  };
}
