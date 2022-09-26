import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
  true,
  []
>;

@injectable()
export class CloseLedgerTransportHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_CLOSE_TRANSPORT as const;

  constructor(private ledgerService: LedgerService) {}

  handle: HandlerType['handle'] = async (request) => {
    await this.ledgerService.closeOpenedTransport();
    return {
      result: true,
      ...request,
    };
  };
}
