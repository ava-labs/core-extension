import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SeedlessMfaService } from '../SeedlessMfaService';
import { RemoveFidoDeviceHandler } from './removeFidoDevice';

describe('src/background/services/seedless/handlers/removeFidoDevice', () => {
  const seedlessMfaService = jest.mocked<SeedlessMfaService>({
    removeFidoDevice: jest.fn(),
  } as any);

  const handle = (id: string) => {
    const handler = new RemoveFidoDeviceHandler(seedlessMfaService);

    return handler.handle({
      method: ExtensionRequest.SEEDLESS_REMOVE_FIDO_DEVICE,
      id: 'abcd-1234',
      params: [id],
      tabId: 1234,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if request fails', async () => {
    seedlessMfaService.removeFidoDevice.mockRejectedValueOnce(
      new Error('Session expired')
    );

    const result = await handle('a1b2c3');

    expect(result.error).toEqual('Session expired');
  });

  it('returns error if ID is not provided', async () => {
    const { error } = await handle('');

    expect(error).toEqual('Device ID is required');
  });

  it('calls .removeFidoDevice() with provided id and tab ID', async () => {
    seedlessMfaService.removeFidoDevice.mockResolvedValue(undefined);

    await handle('abcd-1234');
    expect(seedlessMfaService.removeFidoDevice).toHaveBeenCalledWith(
      'abcd-1234',
      1234
    );
  });
});
