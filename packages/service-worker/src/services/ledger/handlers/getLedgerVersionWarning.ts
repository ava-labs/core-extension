import { ExtensionRequest, ExtensionRequestHandler, LEDGER_VERSION_WARNING_WAS_CLOSED } from '@core/types';
import { injectable } from 'tsyringe';
import { StorageService } from '../../storage/StorageService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SHOW_LEDGER_VERSION_WARNING,
  boolean
>;

@injectable()
export class GetLedgerVersionWarningHandler implements HandlerType {
  method = ExtensionRequest.SHOW_LEDGER_VERSION_WARNING as const;

  constructor(private storageService: StorageService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const result = await this.storageService.loadFromSessionStorage(
      LEDGER_VERSION_WARNING_WAS_CLOSED,
    );

    return {
      ...request,
      result: !!result,
    };
  };
}
