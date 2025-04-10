import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';
import { SeedlessMfaService } from '../SeedlessMfaService';
import { SubmitMfaResponseHandler } from './submitMfaResponse';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/seedless/handlers/submitMfaResponse', () => {
  const mfaService = jest.mocked<SeedlessMfaService>({
    submitMfaResponse: jest.fn(),
  } as any);

  const handle = (response: any) => {
    const handler = new SubmitMfaResponseHandler(mfaService);

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
        id: 'abcd-1234',
        params: [response],
      }),
    );
  };

  it('returns error when response is missing', async () => {
    const result = await handle(null);
    expect(result.error).toEqual('MFA response is required');
  });

  it('returns error when response does not contained the ID', async () => {
    const result = await handle({ code: '1234' });
    expect(result.error).toEqual('unspecified MFA challenge id');
  });

  it('returns error when neither TOTP code nor FIDO answer is provided', async () => {
    const result = await handle({ mfaId: 'mfa-123' });
    expect(result.error).toEqual('TOTP code or FIDO answer is required');
  });

  it('passes the TOTP code to SeedlessMfaService', async () => {
    const challengeResponse = { mfaId: 'mfa-123', code: '1234' };

    await handle(challengeResponse);
    expect(mfaService.submitMfaResponse).toHaveBeenCalledWith(
      challengeResponse,
    );
  });
});
