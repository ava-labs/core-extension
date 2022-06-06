import { getLedgerExtendedPublicKeyOfAccount } from '@avalabs/wallets-sdk';
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
    if (!this.ledgerService.recentTransport) {
      return {
        ...request,
        error:
          'Could not get transport to derive public key, undefined or malformed',
      };
    }

    const [pubKey, pubKeyError] = await resolve(
      getLedgerExtendedPublicKeyOfAccount(this.ledgerService.recentTransport)
    );

    if (pubKeyError) {
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
