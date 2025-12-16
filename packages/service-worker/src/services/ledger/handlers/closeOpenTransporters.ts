import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
  true,
  { currentTransportUUID: string }
>;

@injectable()
export class CloseLedgerTransportHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_CLOSE_TRANSPORT as const;

  constructor(private ledgerService: LedgerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    await this.ledgerService.closeOpenedTransport(
      request.params.currentTransportUUID,
    );
    return {
      result: true,
      ...request,
    };
  };
}
