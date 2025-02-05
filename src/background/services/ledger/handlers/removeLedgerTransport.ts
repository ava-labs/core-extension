import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { LedgerService } from '../LedgerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_REMOVE_TRANSPORT,
  true,
  [ledgerTransportUUID: string]
>;

@injectable()
export class RemoveLedgerTransportHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_REMOVE_TRANSPORT as const;

  constructor(private ledgerService: LedgerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [ledgerTransportUUID] = request.params;

    if (this.ledgerService.getTransport(ledgerTransportUUID)) {
      this.ledgerService.removeTransportFromCache(ledgerTransportUUID);
    }

    return {
      result: true,
      ...request,
    };
  };
}
