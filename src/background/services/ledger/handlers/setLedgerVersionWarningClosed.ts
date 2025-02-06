import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LEDGER_VERSION_WARNING_WAS_CLOSED } from '../models';
import { StorageService } from '../../storage/StorageService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED,
  boolean
>;

@injectable()
export class LedgerVersionWarningClosedHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED as const;

  constructor(private storageService: StorageService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    await this.storageService.saveToSessionStorage(
      LEDGER_VERSION_WARNING_WAS_CLOSED,
      true,
    );

    return {
      ...request,
      result: true,
    };
  };
}
