import { injectable } from 'tsyringe';

import { ExtensionRequestHandler } from '../../../connections/models';
import { ExtensionRequest } from '../../../connections/extensionConnection/models';

import { SeedlessMfaService } from '../SeedlessMfaService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_REMOVE_TOTP,
  void
>;

@injectable()
export class RemoveTotpHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_REMOVE_TOTP as const;

  constructor(private seedlessMfaService: SeedlessMfaService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      return {
        ...request,
        result: await this.seedlessMfaService.removeTotp(request.tabId),
      };
    } catch (error: any) {
      return {
        ...request,
        error: error instanceof Error ? error.message : error.toString(),
      };
    }
  };
}
