import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_INIT_TRANSPORT,
  true,
  [ledgerTransportUUID: string]
>;

@injectable()
export class InitLedgerTransportHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_INIT_TRANSPORT as const;

  constructor(private ledgerService: LedgerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [ledgerTransportUUID] = request.params;
    if (this.ledgerService.getTransport(ledgerTransportUUID)) {
      return {
        result: true,
        ...request,
      };
    }

    try {
      this.ledgerService.initTransport(ledgerTransportUUID);
    } catch (e) {
      return {
        ...request,
        error: (e as Error).message,
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
