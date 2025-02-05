import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { LedgerService } from '../LedgerService';
import type { DeviceResponseData } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_RESPONSE,
  true,
  [response: DeviceResponseData]
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
