import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED } from '../models';
import { StorageService } from '../../storage/StorageService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SHOW_LEDGER_INCORRECT_BTC_APP_WARNING,
  boolean
>;

@injectable()
export class GetLedgerIncorrectBtcAppWarningHandler implements HandlerType {
  method = ExtensionRequest.SHOW_LEDGER_INCORRECT_BTC_APP_WARNING as const;

  constructor(private storageService: StorageService) {}

  handle: HandlerType['handle'] = async (request) => {
    const result = await this.storageService.loadFromSessionStorage(
      LEDGER_INCORRECT_BTC_APP_VERSION_CLOSED
    );

    return {
      ...request,
      result: !!result,
    };
  };
}
