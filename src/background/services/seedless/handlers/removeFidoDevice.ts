import { injectable } from 'tsyringe';

import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import type { SeedlessMfaService } from '../SeedlessMfaService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_REMOVE_FIDO_DEVICE,
  void,
  [id: string]
>;

@injectable()
export class RemoveFidoDeviceHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_REMOVE_FIDO_DEVICE as const;

  constructor(private seedlessMfaService: SeedlessMfaService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [id] = request.params;

    if (!id) {
      return {
        ...request,
        error: 'Device ID is required',
      };
    }

    try {
      return {
        ...request,
        result: await this.seedlessMfaService.removeFidoDevice(
          id,
          request.tabId,
        ),
      };
    } catch (error: any) {
      return {
        ...request,
        error: error instanceof Error ? error.message : error.toString(),
      };
    }
  };
}
