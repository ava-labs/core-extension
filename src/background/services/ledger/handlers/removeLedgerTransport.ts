import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

@injectable()
export class RemoveLedgerTransportHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.LEDGER_REMOVE_TRANSPORT];

  constructor(private ledgerService: LedgerService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params || [];
    const [LEDGER_INIT_UUID] = params;
    if (this.ledgerService.getTransport(LEDGER_INIT_UUID)) {
      this.ledgerService.removeTransportFromCache(LEDGER_INIT_UUID);
    }

    return {
      result: true,
      ...request,
    };
  };
}
