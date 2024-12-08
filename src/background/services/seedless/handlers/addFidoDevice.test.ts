import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { KeyType } from '@src/utils/seedless/fido/types';

import { SeedlessMfaService } from '../SeedlessMfaService';
import { AddFidoDeviceHandler } from './addFidoDevice';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/seedless/handlers/addFidoDevice', () => {
  const seedlessMfaService = jest.mocked<SeedlessMfaService>({
    addFidoDevice: jest.fn(),
  } as any);

  const handle = (name: string, type: KeyType) => {
    const handler = new AddFidoDeviceHandler(seedlessMfaService);

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_ADD_FIDO_DEVICE,
        id: 'abcd-1234',
        params: [name, type],
        tabId: 1234,
      }),
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if request fails', async () => {
    seedlessMfaService.addFidoDevice.mockRejectedValueOnce(
      new Error('Session expired'),
    );

    const result = await handle('yubi', KeyType.Yubikey);

    expect(result.error).toEqual('Session expired');
  });

  it('returns error if name is not provided', async () => {
    const { error } = await handle('', KeyType.Yubikey);

    expect(error).toEqual('Name is required');
  });

  it('returns error if name is not provided', async () => {
    const { error } = await handle('yubi', '' as KeyType);

    expect(error).toEqual('Key type is required');
  });

  it('returns error if name is not provided', async () => {
    const { error } = await handle('yubi', 'what-even-is-that' as KeyType);

    expect(error).toEqual('Unsupported key type: what-even-is-that');
  });

  it('calls .addFidoDevice() with provided name, key type and tab ID', async () => {
    seedlessMfaService.addFidoDevice.mockResolvedValue(undefined);

    await handle('yubi', KeyType.Yubikey);
    expect(seedlessMfaService.addFidoDevice).toHaveBeenCalledWith(
      'yubi',
      KeyType.Yubikey,
      1234,
    );

    await handle('paskij', KeyType.Passkey);
    expect(seedlessMfaService.addFidoDevice).toHaveBeenCalledWith(
      'paskij',
      KeyType.Passkey,
      1234,
    );
  });
});
