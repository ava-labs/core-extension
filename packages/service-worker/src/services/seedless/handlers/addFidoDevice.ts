import { injectable } from 'tsyringe';

import {
  ExtensionRequest,
  ExtensionRequestHandler,
  KeyType,
} from '@core/types';

import { SeedlessMfaService } from '../SeedlessMfaService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_ADD_FIDO_DEVICE,
  void,
  [name: string, keyType: KeyType]
>;

@injectable()
export class AddFidoDeviceHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_ADD_FIDO_DEVICE as const;

  constructor(private seedlessMfaService: SeedlessMfaService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [name, keyType] = request.params;

    if (!name) {
      return {
        ...request,
        error: 'Name is required',
      };
    }

    if (!keyType) {
      return {
        ...request,
        error: 'Key type is required',
      };
    }

    if (keyType !== KeyType.Passkey && keyType !== KeyType.Yubikey) {
      return {
        ...request,
        error: `Unsupported key type: ${keyType}`,
      };
    }

    try {
      return {
        ...request,
        result: await this.seedlessMfaService.addFidoDevice(
          name,
          keyType,
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
