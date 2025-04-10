import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';

import { SeedlessMfaService } from '../SeedlessMfaService';

import { ChooseMfaMethodHandler } from './chooseMfaMethod';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/seedless/handlers/chooseMfaMethod', () => {
  const seedlessMfaService = jest.mocked<SeedlessMfaService>({
    submitChosenMethod: jest.fn(),
  } as any);

  const handle = (choice: any) => {
    const handler = new ChooseMfaMethodHandler(seedlessMfaService);

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_CHOOSE_MFA_METHOD,
        id: 'abcd-1234',
        params: [choice],
        tabId: 1234,
      }),
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error when response is missing', async () => {
    const result = await handle(null);
    expect(result.error).toEqual('MFA method response is required');
  });

  it('returns error when response does not contained the mfaId', async () => {
    const result = await handle({ type: 'totp' });
    expect(result.error).toEqual('unspecified MFA challenge id');
  });

  it('returns error when no method is selected', async () => {
    const result = await handle({ mfaId: 'mfa123' });
    expect(result.error).toEqual('MFA method choice is required');
  });

  it('passes the chosen verification method to SeedlessMfaService', async () => {
    const choice = { mfaId: 'mfa-123', chosenMethod: { type: 'totp' } };

    await handle(choice);
    expect(seedlessMfaService.submitChosenMethod).toHaveBeenCalledWith(
      choice,
      1234,
    );
  });
});
