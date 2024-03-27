import { IdentityProof } from '@cubist-labs/cubesigner-sdk';
import {
  SeedlessRegistartionResult,
  approveSeedlessRegistration,
} from './approveSeedlessRegistration';

describe('src/pages/Onboarding/utils/approveSeedlessRegistration', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...OLD_ENV,
      CUBESIGNER_ENV: 'gamma',
      SEEDLESS_URL: 'https://seedless',
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should call the register API with the right arguments', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ json: jest.fn() });
    await approveSeedlessRegistration({} as IdentityProof, false);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://seedless/v1/register?mfa-required=false',
      {
        body: '{}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    );
  });
  it('should return `ERROR`', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ json: jest.fn() });
    const result = await approveSeedlessRegistration(
      {} as IdentityProof,
      false
    );
    expect(result).toBe(SeedlessRegistartionResult.ERROR);
  });
  it('should return an `ALREADY_REGISTERED` message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ message: 'ALREADY_REGISTERED' }),
    });
    const result = await approveSeedlessRegistration(
      {} as IdentityProof,
      false
    );
    expect(result).toBe(SeedlessRegistartionResult.ALREADY_REGISTERED);
  });
  it('should return an `APPROVED` message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ message: 'ok' }),
    });
    const result = await approveSeedlessRegistration(
      {} as IdentityProof,
      false
    );
    expect(result).toBe(SeedlessRegistartionResult.APPROVED);
  });
});
