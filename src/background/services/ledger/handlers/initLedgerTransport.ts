import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

@injectable()
export class InitLedgerTransportHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.LEDGER_INIT_TRANSPORT];

  constructor(private ledgerService: LedgerService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    if (this.ledgerService.transport) {
      return {
        result: true,
        ...request,
      };
    }

    try {
      await this.ledgerService.initTransport();
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
