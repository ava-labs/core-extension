import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SeedlessMfaService } from '../SeedlessMfaService';
import { RemoveTotpHandler } from './removeTotp';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/seedless/handlers/removeFidoDevice', () => {
  const seedlessMfaService = jest.mocked<SeedlessMfaService>({
    removeTotp: jest.fn(),
  } as any);

  const handle = () => {
    const handler = new RemoveTotpHandler(seedlessMfaService);

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_REMOVE_TOTP,
        id: 'abcd-1234',
        tabId: 1234,
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if request fails', async () => {
    seedlessMfaService.removeTotp.mockRejectedValueOnce(
      new Error('Session expired')
    );

    const result = await handle();

    expect(result.error).toEqual('Session expired');
  });

  it('calls .removeTotp() with derived tab ID', async () => {
    seedlessMfaService.removeTotp.mockResolvedValue(undefined);

    await handle();
    expect(seedlessMfaService.removeTotp).toHaveBeenCalledWith(1234);
  });
});
