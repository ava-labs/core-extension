import { IdentityProof } from '@cubist-labs/cubesigner-sdk';

export enum SeedlessRegistartionResult {
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  APPROVED = 'APPROVED',
  ERROR = 'ERROR',
}

enum SeedlessRegistartionResponseTextStatus {
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  APPROVED = 'ok',
}

export async function approveSeedlessRegistration(
  identityProof: IdentityProof,
  isMfaRequired: boolean,
): Promise<SeedlessRegistartionResult> {
  return fetch(
    process.env.SEEDLESS_URL +
      `/v1/register?mfa-required=${isMfaRequired ? 'true' : 'false'}`,
    {
      method: 'POST',
      body: JSON.stringify(identityProof),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then(async (response) => {
      const { message }: { message: SeedlessRegistartionResponseTextStatus } =
        await response.json();

      if (
        message === SeedlessRegistartionResponseTextStatus.ALREADY_REGISTERED
      ) {
        return SeedlessRegistartionResult.ALREADY_REGISTERED;
      }
      if (message === SeedlessRegistartionResponseTextStatus.APPROVED) {
        return SeedlessRegistartionResult.APPROVED;
      }
      throw new Error(message);
    })
    .catch(() => {
      return SeedlessRegistartionResult.ERROR;
    });
}
