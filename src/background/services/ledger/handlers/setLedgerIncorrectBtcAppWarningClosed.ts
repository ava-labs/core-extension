import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED } from '../models';
import { StorageService } from '../../storage/StorageService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_INCORRECT_BTC_APP_WARNING_CLOSED,
  boolean
>;

@injectable()
export class LedgerIncorrectBtcAppWarningClosedHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_INCORRECT_BTC_APP_WARNING_CLOSED as const;

  constructor(private storageService: StorageService) {}

  handle: HandlerType['handle'] = async (request) => {
    await this.storageService.saveToSessionStorage(
      LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED,
      true
    );

    return {
      ...request,
      result: true,
    };
  };
}
