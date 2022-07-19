import { resolve } from '@avalabs/utils-sdk';
import { getLedgerExtendedPublicKeyOfAccount } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_GET_PUBLIC,
  string
>;

@injectable()
export class GetPublicKeyHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_GET_PUBLIC as const;

  constructor(private ledgerService: LedgerService) {}
  handle: HandlerType['handle'] = async (request) => {
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

    if (pubKeyError instanceof Error) {
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
