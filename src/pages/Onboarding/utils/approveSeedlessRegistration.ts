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
interface SeedlessRegistartionResponseTextObject {
  message: SeedlessRegistartionResponseTextStatus;
}

export async function approveSeedlessRegistration(
  identityProof: IdentityProof
): Promise<SeedlessRegistartionResult> {
  return fetch(process.env.SEEDLESS_URL + '/v1/register', {
    method: 'POST',
    body: JSON.stringify(identityProof),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      const responseText: SeedlessRegistartionResponseTextObject = JSON.parse(
        await response.text()
      );

      if (
        responseText.message ===
        SeedlessRegistartionResponseTextStatus.ALREADY_REGISTERED
      ) {
        return SeedlessRegistartionResult.ALREADY_REGISTERED;
      }
      if (
        responseText.message === SeedlessRegistartionResponseTextStatus.APPROVED
      ) {
        return SeedlessRegistartionResult.APPROVED;
      }
      throw new Error(responseText.message);
    })
    .catch(() => {
      return SeedlessRegistartionResult.ERROR;
    });
}
