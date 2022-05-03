import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

@injectable()
export class LedgerResponseHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.LEDGER_RESPONSE];

  constructor(private ledgerService: LedgerService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params;
    this.ledgerService.ledgerResponse(params?.[0]);

    return {
      ...request,
    };
  };
}
