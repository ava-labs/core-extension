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
  oidcToken: string
): Promise<SeedlessRegistartionResult> {
  // Extract user identity from token
  const payload = JSON.parse(
    Buffer.from(oidcToken.split('.')?.[1] ?? '', 'base64').toString('ascii')
  );
  const iss = payload.iss;
  const sub = payload.sub;
  const email = payload.email;

  return fetch(process.env.SEEDLESS_URL + '/v1/register', {
    method: 'POST',
    body: JSON.stringify({
      iss,
      sub,
      email,
    }),
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
