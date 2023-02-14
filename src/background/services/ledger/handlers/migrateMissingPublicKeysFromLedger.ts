import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { WalletType } from '../../wallet/models';
import { WalletService } from '../../wallet/WalletService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
  boolean
>;

@injectable()
export class MigrateMissingPublicKeysFromLedgerHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS as const;

  constructor(private walletService: WalletService) {}

  handle: HandlerType['handle'] = async (request) => {
    const walletType = this.walletService.walletType;

    if (walletType !== WalletType.LEDGER) {
      return {
        ...request,
        result: true,
      };
    }

    await this.walletService.migrateMissingXPPublicKeys();

    return {
      ...request,
      result: true,
    };
  };
}
