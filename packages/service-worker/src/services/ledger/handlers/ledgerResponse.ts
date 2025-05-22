import {
  ExtensionRequest,
  ExtensionRequestHandler,
  LedgerDeviceResponseData,
} from '@core/types';
import { injectable } from 'tsyringe';
import { LedgerService } from '../LedgerService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_RESPONSE,
  true,
  [response: LedgerDeviceResponseData]
>;

@injectable()
export class LedgerResponseHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_RESPONSE as const;

  constructor(private ledgerService: LedgerService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [response] = request.params;
    this.ledgerService.ledgerResponse(response);

    return {
      ...request,
      result: true,
    };
  };
}
